const apiDefinition = {
    openapi: '3.0.0',
    info: {
      title: 'Integration API - G2A.COM',
      version: '3.256.2',
      description: 'API for selling products on g2a.com',
    },
    servers: [
      {
        url: 'https://sandboxapi.g2a.com',
        description: 'Sandbox server for testing',
      },
      { url: 'https://api.g2a.com', description: 'Production server' },
    ],
    tags: [
      { name: 'Auth' },
      { name: 'Offers' },
      { name: 'Jobs' },
      { name: 'Categories' },
      { name: 'Features' },
      { name: 'Shippings' },
      { name: 'Seller Orders' },
      { name: 'Products' },
      { name: 'Pricing' },
      { name: 'Payments' },
      {
        name: 'Drop shipping',
        description:
          'You can find required contract for your implementation of drop shipping functionality under url below\n' +
          '\n' +
          'https://www.g2a.com/integration-api/documentation/import/contract/\n' +
          '\n' +
          'Integration API will communicate with your API according to data provided in user panel (Selling > Integration API > Import API).\n',
      },
      { name: 'Error codes', description: { $ref: 'errors.md' } },
      { name: 'Changelog', 'x-traitTag': true, description: { $ref: 'changelog.md' } },
    ],
    'x-tagGroups': [
      { name: 'General', tags: ['Auth', 'Jobs', 'Pricing', 'Payments'] },
      { name: 'Sales', tags: ['Seller Orders', 'Offers', 'Products'] },
      { name: 'Others', tags: ['Drop shipping', 'Error codes', 'Changelog'] },
    ],
    paths: {
      '/v3/sales/offers': {
        post: {
          tags: ['Offers'],
          summary: 'Add offer request',
          description: 'Creates new offer and returns jobId',
          operationId: 'addOffer',
          requestBody: { $ref: 'requestBodies.yml#/AddOffer' },
          responses: { '202': { $ref: 'responses.yml#/AddOfferResponse202' }, '400': { $ref: 'responses.yml#/BadRequestExtended' }, '401': { $ref: 'responses.yml#/Unauthorized' }, '409': { $ref: 'responses.yml#/AddOfferResponse409' }, '500': { $ref: 'responses.yml#/InternalServerError' }, '502': { $ref: 'responses.yml#/BadGateway' } },
        },
        get: {
          tags: ['Offers'],
          summary: 'Get offers list',
          description: 'Returns offers list',
          operationId: 'getOffers',
          parameters: [
            { $ref: 'parameters.yml#/ItemsPerPage' },
            { $ref: 'parameters.yml#/Page' },
            { $ref: 'parameters.yml#/UpdatedAtFrom' },
            { $ref: 'parameters.yml#/OfferType' },
            { $ref: 'parameters.yml#/OfferActive' },
          ],
          responses: { '200': { $ref: 'responses.yml#/GetOffers200' }, '400': { $ref: 'responses.yml#/BadRequest' }, '401': { $ref: 'responses.yml#/Unauthorized' }, '500': { $ref: 'responses.yml#/InternalServerError' }, '502': { $ref: 'responses.yml#/BadGateway' } },
        },
      },
      '/v3/sales/offers/inventory': {
        post: {
          tags: ['Offers'],
          summary: 'Create offer inventory keys collection',
          description: 'Creates inventory keys collection used in process of creating offer',
          operationId: 'postOffersInventory',
          requestBody: { $ref: 'requestBodies.yml#/InventoryKeysCollectionPost' },
          responses: { '200': { $ref: 'responses.yml#/CreateInventory200' }, '400': { $ref: 'responses.yml#/BadRequestExtended' }, '401': { $ref: 'responses.yml#/Unauthorized' }, '409': { $ref: 'responses.yml#/Conflict' }, '500': { $ref: 'responses.yml#/InternalServerError' }, '502': { $ref: 'responses.yml#/BadGateway' } },
        },
      },
      '/v3/sales/offers/{offerId}/inventory': {
        get: {
          tags: ['Offers'],
          summary: 'Get offers inventory items list',
          description: 'Returns offers inventory items list',
          operationId: 'getOffersInventory',
          parameters: [
            { $ref: 'parameters.yml#/ItemsPerPage' },
            { $ref: 'parameters.yml#/Page' },
            { $ref: 'parameters.yml#/OfferUuidParam' },
          ],
          responses: { '200': { $ref: 'responses.yml#/GetOffersInventory200' }, '400': { $ref: 'responses.yml#/BadRequest' }, '401': { $ref: 'responses.yml#/Unauthorized' }, '500': { $ref: 'responses.yml#/InternalServerError' }, '502': { $ref: 'responses.yml#/BadGateway' } },
        },
        delete: {
          tags: ['Offers'],
          summary: 'Delete offers inventory item list',
          description: 'Deletes offers inventory items list',
          operationId: 'deleteOffersInventory',
          parameters: [{ $ref: 'parameters.yml#/OfferUuidParam' }],
          responses: { '204': { description: 'No Content' }, '400': { $ref: 'responses.yml#/BadRequest' }, '401': { $ref: 'responses.yml#/Unauthorized' }, '404': { $ref: 'responses.yml#/NotFound' }, '500': { $ref: 'responses.yml#/InternalServerError' }, '502': { $ref: 'responses.yml#/BadGateway' } },
        },
      },
      '/v3/sales/offers/{offerId}/inventory/{itemId}': {
        delete: {
          tags: ['Offers'],
          summary: 'Delete key from offers inventory item list',
          description: 'Deletes key from offers inventory items list',
          operationId: 'deleteKeyFromOffersInventory',
          parameters: [
            { $ref: 'parameters.yml#/OfferUuidParam' },
            { $ref: 'parameters.yml#/ItemId' },
          ],
          responses: { '204': { description: 'No Content' }, '400': { $ref: 'responses.yml#/BadRequest' }, '401': { $ref: 'responses.yml#/Unauthorized' }, '404': { $ref: 'responses.yml#/NotFound' }, '500': { $ref: 'responses.yml#/InternalServerError' }, '502': { $ref: 'responses.yml#/BadGateway' } },
        },
      },
      '/v3/sales/offers/{offerId}': {
        parameters: [{ $ref: 'parameters.yml#/OfferUuidParam' }],
        get: {
          tags: ['Offers'],
          summary: 'Get offer',
          description: 'Returns offer details',
          operationId: 'getOffer',
          responses: { '200': { $ref: 'responses.yml#/GetOffer200' }, '400': { $ref: 'responses.yml#/BadRequest' }, '401': { $ref: 'responses.yml#/Unauthorized' }, '404': { $ref: 'responses.yml#/NotFound' }, '500': { $ref: 'responses.yml#/InternalServerError' }, '502': { $ref: 'responses.yml#/BadGateway' } },
        },
        patch: {
          tags: ['Offers'],
          summary: 'Update offer',
          description: 'Updates offer',
          operationId: 'updateOffer',
          requestBody: { $ref: 'requestBodies.yml#/UpdateOffer' },
          responses: { '204': { description: 'No Content' }, '400': { $ref: 'responses.yml#/BadRequestExtended' }, '401': { $ref: 'responses.yml#/Unauthorized' }, '404': { $ref: 'responses.yml#/NotFound' }, '500': { $ref: 'responses.yml#/InternalServerError' }, '502': { $ref: 'responses.yml#/BadGateway' } },
        },
        delete: {
          tags: ['Offers'],
          summary: 'Delete offer',
          description: 'Deletes offer',
          operationId: 'deleteOffer',
          responses: { '204': { description: 'No Content' }, '400': { $ref: 'responses.yml#/BadRequest' }, '401': { $ref: 'responses.yml#/Unauthorized' }, '404': { $ref: 'responses.yml#/NotFound' }, '500': { $ref: 'responses.yml#/InternalServerError' }, '502': { $ref: 'responses.yml#/BadGateway' } },
        },
      },
      '/v3/sales/orders': {
        get: {
          tags: ['Seller Orders'],
          summary: 'Get seller orders list',
          description: 'Returns seller orders list',
          operationId: 'getSellerOrders',
          parameters: [
            { $ref: 'parameters.yml#/ItemsPerPage' },
            { $ref: 'parameters.yml#/Page' },
            { $ref: 'parameters.yml#/CreatedAtFrom' },
            { $ref: 'parameters.yml#/OrderStatus' },
            { $ref: 'parameters.yml#/DeliveryStatus' },
          ],
          responses: { '200': { $ref: 'responses.yml#/GetSellerOrders200' }, '400': { $ref: 'responses.yml#/BadRequest' }, '401': { $ref: 'responses.yml#/Unauthorized' }, '500': { $ref: 'responses.yml#/InternalServerError' }, '502': { $ref: 'responses.yml#/BadGateway' } },
        },
      },
      '/v3/sales/orders/{orderId}': {
        parameters: [{ $ref: 'parameters.yml#/OrderUuidParam' }],
        get: {
          tags: ['Seller Orders'],
          summary: 'Get seller order',
          description: 'Returns seller order details',
          operationId: 'getSellerOrder',
          responses: { '200': { $ref: 'responses.yml#/GetSellerOrder200' }, '400': { $ref: 'responses.yml#/BadRequest' }, '401': { $ref: 'responses.yml#/Unauthorized' }, '404': { $ref: 'responses.yml#/NotFound' }, '500': { $ref: 'responses.yml#/InternalServerError' }, '502': { $ref: 'responses.yml#/BadGateway' } },
        },
      },
      '/v4/sales/orders': {
        get: {
          tags: ['Seller Orders'],
          summary: 'Get seller orders list v4',
          description: 'Returns seller orders list v4',
          operationId: 'getSellerOrdersV4',
          parameters: [
            { $ref: 'parameters.yml#/ItemsPerPage' },
            { $ref: 'parameters.yml#/Page' },
            { $ref: 'parameters.yml#/CreatedAtFrom' },
            { $ref: 'parameters.yml#/OrderStatus' },
            { $ref: 'parameters.yml#/DeliveryStatus' },
          ],
          responses: { '200': { $ref: 'responses.yml#/GetSellerOrdersV4' }, '400': { $ref: 'responses.yml#/BadRequest' }, '401': { $ref: 'responses.yml#/Unauthorized' }, '500': { $ref: 'responses.yml#/InternalServerError' }, '502': { $ref: 'responses.yml#/BadGateway' } },
        },
      },
      '/v4/sales/orders/{orderId}': {
        parameters: [{ $ref: 'parameters.yml#/OrderUuidParam' }],
        get: {
          tags: ['Seller Orders'],
          summary: 'Get seller order v4',
          description: 'Returns seller order details v4',
          operationId: 'getSellerOrderV4',
          responses: { '200': { $ref: 'responses.yml#/GetSellerOrderV4' }, '400': { $ref: 'responses.yml#/BadRequest' }, '401': { $ref: 'responses.yml#/Unauthorized' }, '404': { $ref: 'responses.yml#/NotFound' }, '500': { $ref: 'responses.yml#/InternalServerError' }, '502': { $ref: 'responses.yml#/BadGateway' } },
        },
      },
      '/v3/sales/orders/{orderId}/items/{itemId}/packages': {
        parameters: [
          { $ref: 'parameters.yml#/OrderUuidParam' },
          { $ref: 'parameters.yml#/OrderItemId' },
        ],
        post: {
          tags: ['Seller Orders'],
          summary: 'Add new package',
          description: 'Adds new package',
          operationId: 'addNewPackage',
          requestBody: { $ref: 'requestBodies.yml#/AddPackage' },
          responses: { '202': { $ref: 'responses.yml#/AddPackageResponse202' }, '400': { $ref: 'responses.yml#/BadRequestExtended' }, '401': { $ref: 'responses.yml#/Unauthorized' }, '404': { $ref: 'responses.yml#/NotFound' }, '500': { $ref: 'responses.yml#/InternalServerError' }, '502': { $ref: 'responses.yml#/BadGateway' } },
        },
      },
      '/v3/sales/orders/{orderId}/items/{itemId}/packages/{packageId}': {
        parameters: [
          { $ref: 'parameters.yml#/OrderUuidParam' },
          { $ref: 'parameters.yml#/OrderItemId' },
          { $ref: 'parameters.yml#/PackageUuidParam' },
        ],
        patch: {
          tags: ['Seller Orders'],
          summary: 'Update package',
          description: 'Updates package',
          operationId: 'updatePackage',
          requestBody: { $ref: 'requestBodies.yml#/UpdatePackage' },
          responses: { '204': { description: 'No Content' }, '400': { $ref: 'responses.yml#/BadRequestExtended' }, '401': { $ref: 'responses.yml#/Unauthorized' }, '404': { $ref: 'responses.yml#/NotFound' }, '500': { $ref: 'responses.yml#/InternalServerError' }, '502': { $ref: 'responses.yml#/BadGateway' } },
        },
      },
      '/v1/products': {
        get: {
          tags: ['Products'],
          summary: 'Get products list',
         
  