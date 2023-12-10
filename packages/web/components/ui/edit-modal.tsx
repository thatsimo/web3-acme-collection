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
  Spinner,
  FormControl,
} from '@chakra-ui/react'
import { useRef, useState } from 'react'
import { NftMetadataType } from './nft-list'
import { useCustomName } from '../../hooks/useCustomName'

type EditModalProps = {
  isOpen: boolean
  onClose: () => void
  loading?: boolean
  nft: NftMetadataType
}

export const EditModal = ({
  isOpen,
  onClose,
  loading,
  nft: { tokenId, name },
}: EditModalProps) => {
  const initialRef = useRef(null)
  const [customName, setCustomName] = useState('')

  const { editCustomName } = useCustomName({
    tokenId,
  })

  return (
    <Modal
      onClose={onClose}
      initialFocusRef={initialRef}
      isOpen={isOpen}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Name</ModalHeader>
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel>Custom Name</FormLabel>
            <Input
              ref={initialRef}
              placeholder={name}
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <ButtonGroup gap="2">
            <Button
              colorScheme="teal"
              isDisabled={loading || !customName}
              onClick={() => editCustomName(customName)}
            >
              {loading && <Spinner mr={3} size="sm" color="white" />}
              {loading ? 'Saving...' : 'Save'}
            </Button>
            <Button onClick={onClose}>Close</Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
