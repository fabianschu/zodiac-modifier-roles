import { ChainId, FunctionPermissionCoerced } from "zodiac-roles-sdk"

import { AbiFunction, toFunctionSelector } from "viem"
import Flex from "@/ui/Flex"
import ConditionView from "../ConditionView"
import classes from "./style.module.css"
import { DiffFlag } from "../types"
import DiffBox from "../DiffBox"
import LabeledData from "@/ui/LabeledData"
import Switch from "@/ui/Switch"
import Anchor from "@/ui/Anchor"

const FunctionPermissionItem: React.FC<
  FunctionPermissionCoerced & {
    diff?: DiffFlag
    modified?: FunctionPermissionCoerced
    chainId: ChainId
    abi?: AbiFunction[]
  }
> = ({
  chainId,
  targetAddress,
  selector,
  diff,
  abi,
  modified,
  condition,
  send,
  delegatecall,
}) => {
  const functionAbi = abi?.find(
    (fragment: any) =>
      fragment.type === "function" && toFunctionSelector(fragment) === selector
  ) as AbiFunction | undefined

  return (
    <DiffBox
      diff={diff}
      modified={
        modified && (
          <FunctionPermissionItem {...modified} chainId={chainId} abi={abi} />
        )
      }
    >
      <div className={classes.functionContainer}>
        {functionAbi ? (
          <AbiFunctionPermissionItem
            targetAddress={targetAddress}
            selector={selector}
            abi={functionAbi}
            condition={condition}
            send={send}
            delegatecall={delegatecall}
          />
        ) : (
          <RawFunctionPermissionItem
            targetAddress={targetAddress}
            selector={selector}
            condition={condition}
            send={send}
            delegatecall={delegatecall}
          />
        )}
        <div className={classes.verticalGuide} />
      </div>
    </DiffBox>
  )
}

export default FunctionPermissionItem

const RawFunctionPermissionItem: React.FC<FunctionPermissionCoerced> = async ({
  targetAddress,
  selector,
  condition,
  delegatecall,
  send,
}) => {
  return (
    <Flex direction="column" gap={3}>
      <Flex direction="row" gap={0} justifyContent="space-between">
        <LabeledData label="Function Selector">
          <Flex gap={2} alignItems="center">
            <Anchor
              name={`${targetAddress}-${selector}`}
              className={classes.anchor}
            />
            <div className={classes.selector}>{selector}</div>
          </Flex>
        </LabeledData>
        <Flex gap={3} alignItems="start">
          <LabeledData label="Send value">
            <Switch checked={!!send} disabled />
          </LabeledData>
          <LabeledData label="Delegate call">
            <Switch checked={!!delegatecall} disabled />
          </LabeledData>
        </Flex>
      </Flex>
      {condition ? (
        <ConditionView {...{ condition }} />
      ) : (
        <div className={classes.conditionEmpty}>No condition set</div>
      )}
    </Flex>
  )
}

const AbiFunctionPermissionItem: React.FC<
  FunctionPermissionCoerced & { abi: AbiFunction }
> = async ({ targetAddress, selector, condition, delegatecall, send, abi }) => {
  const params = abi.inputs?.map((input) => input.type + " " + input.name) || []

  return (
    <Flex direction="column" gap={3}>
      <Flex direction="row" gap={0} justifyContent="space-between">
        <LabeledData label="Function Signature">
          <Flex gap={2} alignItems="center" className={classes.signature}>
            <Anchor
              name={`${targetAddress}-${selector}`}
              className={classes.anchor}
            />
            <div className={classes.selector}>{abi.name}</div>

            <Flex gap={1} alignItems="start" wrap className={classes.params}>
              {params.map((param, i) => (
                <code className={classes.param} key={i}>
                  {param}
                </code>
              ))}
            </Flex>

            <div className={classes.selectorSmall}>{selector}</div>
          </Flex>
        </LabeledData>
        <Flex gap={3} alignItems="start">
          <LabeledData label="Send value">
            <Switch checked={!!send} disabled />
          </LabeledData>
          <LabeledData label="Delegate call">
            <Switch checked={!!delegatecall} disabled />
          </LabeledData>
        </Flex>
      </Flex>
      {condition ? (
        <ConditionView {...{ condition, abi }} />
      ) : (
        <div className={classes.conditionEmpty}>No condition set</div>
      )}
    </Flex>
  )
}
