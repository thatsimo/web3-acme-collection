import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  FormLabel,
  Button,
  ButtonGroup,
  Input,
  useToast,
  FormControl,
} from '@chakra-ui/react'
import { useRef, useState } from 'react'

type UploadModalProps = {
  isOpen: boolean
  onClose: () => void
  loading?: boolean
  uploadAndMint: (file: any, customName?: string) => void
}

export const UploadModal = ({
  isOpen,
  onClose,
  loading,
  uploadAndMint,
}: UploadModalProps) => {
  const inputFile = useRef(null)
  const initialRef = useRef(null)
  const toast = useToast()
  const [customName, setCustomName] = useState('')

  const handleChange = (e: any) => {
    uploadAndMint(e.target.files[0], customName)
  }

  return (
    <Modal
      onClose={onClose}
      initialFocusRef={initialRef}
      isOpen={isOpen}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Mint NFT</ModalHeader>
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel>Custom Name (optional)</FormLabel>
            <Input
              ref={initialRef}
              placeholder="ACME Product"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <ButtonGroup gap="2">
            <Input
              type="file"
              id="file"
              ref={inputFile}
              onChange={handleChange}
              isDisabled={loading}
              style={{ display: 'none' }}
            />
            <Button
              colorScheme="teal"
              isDisabled={loading}
              onClick={() =>
                inputFile?.current && (inputFile.current as any).click()
              }
            >
              {loading ? 'Uploading...' : 'Upload & Mint'}
            </Button>
            <Button onClick={onClose}>Close</Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
