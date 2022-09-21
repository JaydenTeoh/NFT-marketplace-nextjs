import { useState } from "react"
import { Modal, Input, useNotification } from "web3uikit"
import { useWeb3Contract } from "react-moralis"
import nftMarketplaceABI from "../constants/NftMarketplace.json"
import { ethers } from "ethers"

export default function UpdateListingModal({
    nftAddress,
    tokenId,
    isVisible,
    marketplaceAddress,
    onClose,
}) {
    const dispatch = useNotification()
    const [priceToUpdate, setPriceToUpdate] = useState(0)
    const handleUpdateListingSuccess = async (tx) => {
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "Listing Updated",
            title: "Listing Updated - please refresh",
            position: "topR",
        })
        onClose && onClose()
        setPriceToUpdate("0")
    }
    const { runContractFunction: updateListing } = useWeb3Contract({
        abi: nftMarketplaceABI,
        contractAddress: marketplaceAddress,
        functionName: "updateListing",
        params: {
            nftAddress: nftAddress,
            tokenId: tokenId,
            newPrice: ethers.utils.parseEther(priceToUpdate || "0"),
        },
    })

    return (
        <Modal
            isVisible={isVisible}
            onCancel={onClose}
            onCloseButtonPressed={onClose}
            onOk={() => {
                updateListing({
                    onError: (error) => {
                        console.log(error)
                    },
                    onSuccess: handleUpdateListingSuccess,
                })
            }}
        >
            <Input
                label="Update pricing in L1 currency (ETH)"
                name="New Listing Price"
                type="number"
                onChange={(event) => {
                    setPriceToUpdate(event.target.value)
                }}
            />
        </Modal>
    )
}
