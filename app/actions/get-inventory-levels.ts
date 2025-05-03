export const getInventoryLevels = async ({
	locationIds,
	inventoryItemIds,
}: { locationIds: string[]; inventoryItemIds: string[] }): Promise<[]> => {
	if (!process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN) {
		throw new Error("SHOPIFY_ADMIN_API_ACCESS_TOKEN is not set");
	}

	const query = `
    query getInventoryLevels($inventoryItemIds: [ID!]!, $locationIds: [ID!]!) {
    inventoryItems(first: 250, query: $inventoryItemQuery) {
      edges {
        node {
          id
          inventoryLevels(first: 50, query: $locationQuery) {
            edges {
              node {
                id
                available
                location {
                  id
                }
              }
            }
          }
        }
      }
    }
  }
`;

	const inventoryItemQuery = inventoryItemIds
		.map((id) => `id:${id}`)
		.join(" OR ");

	const locationQuery = locationIds
		.map((id) => `location_id:${id}`)
		.join(" OR ");

	const response = await fetch(
		"https://shop.narai.jp/admin/api/2024-10/graphql.json",
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN,
			},
			body: JSON.stringify({
				query,
				variables: {
					inventoryItemQuery,
					locationQuery,
				},
			}),
		},
	);

	const data = await response.json();
	// console.debug("getInventoryLevels Response:", {
	// 	status: response.status,
	// 	data,
	// 	inventoryItemQuery,
	// 	locationQuery,
	// });
	return data;

	// const endpoint = `https://shop.narai.jp/admin/api/2024-10/inventory_levels.json?inventory_item_ids=${inventoryItemIds}&location_ids=${locationIds}`;

	// const response = await fetch(endpoint, {
	// 	method: "GET",
	// 	headers: {
	// 		"Content-Type": "application/json",
	// 		"X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN,
	// 	},
	// });

	// const data = await response.json();

	// console.debug("getInventory :: ", { endpoint, response, data });

	// console.debug("getInventory Response:", {
	// 	status: response.status,
	// 	// headers: Object.fromEntries(response.headers.entries()),
	// 	data: response,
	// });

	// if (!response.ok) {
	// 	throw new Error("Failed to fetch inventories");
	// }

	// return data.inventory_levels;
};
