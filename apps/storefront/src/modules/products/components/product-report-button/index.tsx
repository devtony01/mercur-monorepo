"use client"

import { Button } from "@medusajs/ui"
import useToggleState from "@lib/hooks/use-toggle-state"
import Modal from "@modules/common/components/modal"

export const ProductReportButton = () => {
  const { state: isOpen, open, close } = useToggleState()

  return (
    <>
      <Button
        variant="secondary"
        size="small"
        onClick={open}
        className="uppercase"
      >
        Report listing
      </Button>
      <Modal isOpen={isOpen} close={close}>
        <Modal.Title>Report listing</Modal.Title>
        <Modal.Body>
          <div className="p-4">
            <p className="text-ui-fg-base">
              Report functionality will be implemented here.
            </p>
            <div className="flex justify-end mt-4">
              <Button onClick={close} variant="secondary">
                Close
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}