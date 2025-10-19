import { WorkflowResponse, createWorkflow } from '@medusajs/workflows-sdk'

import { UpdateCommissionRuleDTO } from '@mercurjs/framework'

import { updateCommissionRuleStep } from '../steps'

export const updateCommissionRuleWorkflow = createWorkflow(
  'update-commission-rule',
  function (input: UpdateCommissionRuleDTO) {
    const result = updateCommissionRuleStep(input)
    return new WorkflowResponse(result)
  }
)
