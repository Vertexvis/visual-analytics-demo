# Vertex 3D Visual Analytics Demo

Connect external data sources to your 3D digital twin and deliver powerful insights with ease.

Load a Vertex sample scene and download the corresponding CSV files of test data. Simply drag and drop the CSV files onto the app, and watch as your view updates to reflect the values found in the test data.

The `data` directory contains data for our test models. At a minimum, each row has the supplied ID of a scene item. You supply these IDs to Vertex. They're likely existing part and/or revision IDs from your PLM system.

As an example, if your 3D data file contains unique metadata properties for each part instance, you can specify it while following our [Import data](https://developer.vertexvis.com/docs/guides/import-data) guide. When creating the JSON file in the **Importing data** step, include the `suppliedInstanceIdKey` parameter. It will store these supplied ID in Vertex's Parts Library and set them as the scene item supplied IDs on scene creation.

```json title="vertex-valve.json"
[
  {
    "indexMetadata": true,
    "source": {
      "fileName": "[YOUR_PATH_TO_3D_DATA_FILE_INCLUDING_FILE_EXTENSION]",
      "suppliedPartId": "vertex-valve",
      "suppliedRevisionId": "1"
    },
    "suppliedInstanceIdKey": "InstanceID"
  }
]
```

The other required columns in the CSV files depend on what you'd like to see. This demo supports three types of visualizations:

1. Heat maps: Determine the range of boolean (0 or 1), integer, or floating-point numbers in the `heatMapNumber` column. The application then calculates where each scene item's value lies on a between the min and max values and assigns a red-to-green gradient to it. For example,

   ```csv
   suppliedId,heatMapNumber
   a,11
   b,6
   c,1
   ```

   The minimum is one and the maximum is eleven, making the range 10. It will color `c` green, `a` red, and `b` yellow since it lies in the middle of the distribution.

1. Tables: The application finds unique occurrences of the values in the `tableValue` column and display the counts in a table. When first encountering a new `tableValue`, if there is a color in the `color` column, it uses it. Otherwise, it picks a random color. For example (notice you only have to specify the color once per `tableValue`),

   ```csv
   suppliedId,tableValue,color
   a,ACME,#6366F1
   b,Initech,#EF4444
   c,ACME,
   ```

   This will output the following table in the UI and color the corresponding scene items as specified,

   |     | Value   | Count |
   | --- | ------- | ----- |
   | x   | ACME    | 2     |
   | x   | Initech | 1     |

   It then allows you to toggle each individually to see where they exist on the model.

1. Colors: Provide a value in the `color` column and the application colors the corresponding scene item appropriately.

## Run locally in Docker

1. Clone repository, `git clone git@github.com:Vertexvis/visual-analytics-demo.git`
1. Copy `.env.local.template` to `.env.local` and optionally edit values
1. Run `docker-compose --file ./docker-compose.yml up`
1. Browse to http://localhost:3000

If you pull down changes, you'll need to run `docker-compose --file ./docker-compose.yml build` to build them and then `docker-compose --file ./docker-compose.yml up` again.

## Local development

1. Clone repository, `git clone git@github.com:Vertexvis/visual-analytics-demo.git`
1. Copy `.env.local.template` to `.env.local` and optionally edit values
1. Install dependencies, `yarn install`
1. Run `yarn dev` to start the local development server
1. Browse to http://localhost:3000

## Project organization

```text
data/                     // Sample data
  [model-name]/
    heat-maps/
      costs.csv           // Costs per scene item.
      defects.csv         // Defects per scene item. Could also be warranty claims, failure rates, etc.
      missing-colors.csv  // Scene items that are missing colors are show as red.
    tables/
      suppliers.csv       // Display table of each scene item's supplier.
    colors.csv            // Color each scene item the corresponding color.
public/                   // Static assets
src/
  components/             // Components used in pages
  lib/                    // Shared libraries and utilities
  pages/                  // Pages served by NextJS
```

### Deployment

A few options for deployment,

- [Vercel](https://nextjs.org/docs/deployment)
- [Netlify](https://www.netlify.com/blog/2020/11/30/how-to-deploy-next.js-sites-to-netlify/)
- [AWS CDK](https://github.com/serverless-nextjs/serverless-next.js#readme)
