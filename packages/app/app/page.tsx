"use client"
import { isAddress } from "viem"
import { useState } from "react"
import classes from "./page.module.css"
import Box from "@/ui/Box"
import Flex from "@/ui/Flex"
import Button, { LinkButton } from "@/ui/Button"
import Field from "@/ui/Field"
import ChainSelect from "@/components/ChainSelect"
import { CHAINS, ChainId, DEFAULT_CHAIN } from "@/app/chains"
import Layout from "@/components/Layout"
import Link from "next/link"

const chains = Object.values(CHAINS)

export default function AttachMod() {
  const [chainId, setChainId] = useState<ChainId>(DEFAULT_CHAIN.id)
  const [address, setAddress] = useState("")
  return (
    <Layout>
      <main className={classes.main}>
        <Flex direction="column" gap={3} className={classes.about}>
          <h2>Granular permissions for smart accounts</h2>
          <p>
            The Roles mod allows any account to act on behalf of a smart
            account. Specify contracts, functions and parameters to securely
            restrict the transactions a Role can execute.
          </p>
        </Flex>
        <Flex gap={4}>
          <Flex gap={2} direction="column" className={classes.viewRole}>
            <h3>View a Roles mod instance</h3>

            <Flex direction="column" gap={3} alignItems="end">
              <Field label="Chain">
                <ChainSelect
                  value={chainId}
                  onChange={(nextChainId) => {
                    setChainId(nextChainId)
                    setAddress(
                      CHAINS[nextChainId].prefix + ":" + unprefix(address)
                    )
                  }}
                />
              </Field>
              <Field label="Roles mod address">
                <input
                  type="text"
                  placeholder={DEFAULT_CHAIN.prefix + ":0x..."}
                  spellCheck="false"
                  value={address}
                  onFocus={(ev) =>
                    ev.target.setSelectionRange(0, ev.target.value.length)
                  }
                  onChange={(ev) => {
                    const { value } = ev.target
                    if (value.indexOf(":") > 0) {
                      const [chainPrefix] = value.split(":")
                      const nextChainId =
                        chains.find((chain) => chain.prefix === chainPrefix)
                          ?.id || chainId
                      setChainId(nextChainId)
                    }
                    setAddress(value)
                  }}
                />
              </Field>
              <LinkButton
                href={isAddress(unprefix(address)) ? "/" + address : ""}
                className={classes.attachButton}
              >
                View instance
              </LinkButton>
            </Flex>
          </Flex>
          <Flex direction="column" gap={2} className={classes.learn}>
            <h3>Learn more about Roles</h3>
            <Flex justifyContent="space-between" gap={3}>
              <Link
                href="https://docs.roles.gnosisguild.org"
                className={classes.learnLink}
              >
                <Flex gap={3}>
                  <figure>📜</figure>
                  <Flex gap={2} direction="column">
                    <h4>Read the docs</h4>
                    <p>Learn what Roles are and how to create permissions</p>
                  </Flex>
                </Flex>
              </Link>
              <Link
                href="https://docs.roles.gnosisguild.org"
                className={classes.learnLink}
              >
                <Flex gap={3}>
                  <figure>📯</figure>
                  <Flex gap={2} direction="column">
                    <h4>Read the blog post</h4>
                    <p>Roles v2 is more customizable and more gas efficient</p>
                  </Flex>
                </Flex>
              </Link>
            </Flex>
          </Flex>
        </Flex>
      </main>
    </Layout>
  )
}

const unprefix = (value: string) => {
  if (value.indexOf(":") > 0) {
    const [, address] = value.split(":")
    return address
  } else {
    return value
  }
}
