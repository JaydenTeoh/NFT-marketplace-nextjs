//Add items when they are listed on marketplace
//Remove them when they are bought or cancelled

Moralis.Cloud.afterSave("ItemListed", async (request) => {
    //Every event gets triggered twice, once tx goes through and again when tx is confirmed
    //We only want to update active item when tx is confirmed
    const confirmed = request.object.get("confirmed")
    const logger = Moralis.Cloud.getLogger()
    logger.info("Looking for confirmed tx")
    if (confirmed) {
        logger.info("Found item!")
        const ActiveItem = Moralis.Object.extend("ActiveItem")
        const query = new Moralis.Query("ActiveItem")
        query.equalTo("marketplaceAddress", request.object.get("address"))
        query.equalTo("nftAddress", request.object.get("nftAddress"))
        query.equalTo("tokenId", request.object.get("tokenId"))
        query.equalTo("seller", request.object.get("seller"))
        const alreadyListedItem = await query.first()
        if (alreadyListedItem) {
            logger.info(`Deleting already listed ${request.object.get("objectId")}`)
            await alreadyListedItem.destroy()
            logger.info(
                `Deleted item with tokenId ${request.object.get(
                    "tokenId"
                )} at address ${request.object.get("address")} since it's already been listed`
            )
        }
        const activeItem = new ActiveItem()
        activeItem.set("marketplaceAddress", request.object.get("address"))
        activeItem.set("nftAddress", request.object.get("nftAddress"))
        activeItem.set("price", request.object.get("price"))
        activeItem.set("tokenId", request.object.get("tokenId"))
        activeItem.set("seller", request.object.get("seller"))
        logger.info(
            `Adding Address: ${request.object.get("address")} TokenId: ${request.object.get(
                "tokenId"
            )} `
        )
        logger.info("Saving...")
        await activeItem.save()
    }
})

Moralis.Cloud.afterSave("ItemCancelled", async (request) => {
    const confirmed = request.object.get("confirmed")
    const logger = Moralis.Cloud.getLogger()
    logger.info(`Marketplace | Object: ${request.object}`)
    if (confirmed) {
        const ActiveItem = Moralis.Object.extend("ActiveItem")
        const query = new Moralis.Query(ActiveItem)
        query.equalTo("marketplaceAddress", request.object.get("address"))
        query.equalTo("nftAddress", request.object.get("nftAddress"))
        query.equalTo("tokenId", request.object.get("tokenId"))
        logger.info(`Marketplace | Query: ${query}`)
        const cancelledItem = await query.first()
        logger.info(`Marketplace | CancelledItem: ${JSON.stringify(cancelledItem)}`)
        if (cancelledItem) {
            await cancelledItem.destroy()
            logger.info(
                `Deleting ${request.object.get("tokenId")} at address ${request.object.get(
                    "address"
                )} since it was cancelled`
            )
        } else {
            logger.info(
                `No item found with address ${request.object.get(
                    "address"
                )} and tokenId ${request.object.get("tokenId")}`
            )
        }
    }
})

Moralis.Cloud.afterSave("ItemBought", async (request) => {
    const confirmed = request.object.get("confirmed")
    const logger = Moralis.Cloud.getLogger()
    logger.info(`Marketplace | Object: ${request.object}`)
    if (confirmed) {
        const ActiveItem = Moralis.Object.extend("ActiveItem")
        const query = new Moralis.Query(ActiveItem)
        query.equalTo("marketplaceAddress", request.object.get("address"))
        query.equalTo("nftAddress", request.object.get("nftAddress"))
        query.equalTo("tokenId", request.object.get("tokenId"))
        logger.info(`Marketplace | Query: ${query}`)
        const boughtItem = await query.first()
        logger.info(`Marketplace | BoughtItem: ${JSON.stringify(boughtItem)}`)
        if (boughtItem) {
            await boughtItem.destroy()
            logger.info(
                `Deleting ${request.object.get("tokenId")} at address ${request.object.get(
                    "address"
                )} since it was purchased`
            )
        } else {
            logger.info(
                `No item found with address ${request.object.get(
                    "address"
                )} and tokenId ${request.object.get("tokenId")}`
            )
        }
    }
})
