// Type for a single location node
interface LocationNode {
	id: string;
	name: string;
	admin_graphql_api_id: string;
}

// type LocationsResponse = {
// 	data: {
// 		locations: {
// 			edges: Array<{
// 				node: {
// 					id: string;
// 					name: string;
// 				};
// 			}>;
// 		};
// 	};
// };

export const getLocations = async (): Promise<LocationNode[]> => {
	if (!process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN) {
		throw new Error("SHOPIFY_ADMIN_API_ACCESS_TOKEN is not set");
	}

	// ! EXPERIMENTAL: GraphQL implementation
	// const query = `
	//   query {
	//     locations(first: 10) {
	//       edges {
	//         node {
	//           id
	//           name
	//         }
	//       }
	//     }
	//   }
	// `;

	// const { status, body } = await shopifyAdminFetch<LocationsResponse>({
	// 	query,
	// });

	// console.debug("getLocations GraphQL :: ", {
	// 	status,
	// 	count: body.data.locations.edges.length,
	// 	body: body.data.locations.edges.map((edge) => edge.node),
	// });
	// ! END: GraphQL implementation

	const response = await fetch(
		"https://shop.narai.jp/admin/api/2023-10/locations.json",
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN,
			},
		},
	);

	const data = await response.json();

	// console.debug("getLocations REST :: ", { data });

	if (!response.ok) {
		throw new Error("Failed to fetch locations");
	}

	return data.locations;
};
