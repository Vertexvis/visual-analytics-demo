# Vertex Business Intelligence Demo

Overlay dynamic business intelligence data onto 3D models using the Vertex Platform. This allows anyone in your organization to quickly visualize data to find correlations and patterns easily missed in spreadsheets.

The `data` directory contains examples for our test model. At a minimum, each row has the supplied ID of a scene item. The other required columns depend on what you'd like to see. This demo supports three types of visualizations:

1. Heat maps: Determine the range of boolean (0 or 1), integer, or floating-point numbers in the `heatMapNumber` column and then calculate where each scene item's value lies on a red-to-green gradient. For example,

   ```csv
   suppliedId,heatMapNumber
   a,11
   b,6
   c,1
   ```

   The minimum is one and the maximum is eleven, making the range 10. It will color `c` green, `a` red, and `b` yellow since it lies in the middle of the distribution.

1. Tables: Find unique occurrences the values in the `tableValue` column and display the counts in a table. When first encountering a new `tableValue`, if there is a color in the `color` column, use it. Otherwise, pick a random color. For example (notice you only have to specify color once per `tableValue`),

   ```csv
   suppliedId,tableValue,color
   a,ACME,#6366F1
   b,T's Tools,#EF4444
   c,ACME,
   ```

   This will output this table in the UI and color the corresponding scene items as specified,

   |     | Value     | Count |
   | --- | --------- | ----- |
   | x   | ACME      | 2     |
   | x   | T's Tools | 1     |

   It then allows you to toggle each individually to see where they exist on the model.

1. Colors: Provide a value in the `color` column and it will color the corresponding scene item that color.

## Example data

```text
heat-maps/
  costs.csv           // Visualize costs of scene items.
  defects.csv         // Defects per scene-item. Could also be warranty claims, failure rates, etc.
  missing-colors.csv  // Scene items that are missing colors are red.
tables/
  suppliers.csv       // Display a table of each scene item's supplier.
colors.csv            // Color each scene item the corresponding color.
```

## Run locally in Docker

1. Clone repository, `git clone git@github.com:Vertexvis/business-intelligence-demo.git`
1. Copy `.env.local.template` to `.env.local` and optionally edit values
1. Run `docker-compose --file ./docker-compose.yml up`
1. Browse to http://localhost:3000

If you pull down changes, you'll need to run `docker-compose --file ./docker-compose.yml build` to build them and then `docker-compose --file ./docker-compose.yml up` again.

## Local development

1. Clone repository, `git clone git@github.com:Vertexvis/business-intelligence-demo.git`
1. Copy `.env.local.template` to `.env.local` and optionally edit values
1. Install dependencies, `yarn install`
1. Run `yarn dev` to start the local development server
1. Browse to http://localhost:3000

## Project organization

```text
public/       // Static assets
src/
  components/ // Components used in pages
  lib/        // Shared libraries and utilities
  pages/      // Pages served by NextJS
```

### Deployment

A few options for deployment,

- [Vercel](https://nextjs.org/docs/deployment)
- [Netlify](https://www.netlify.com/blog/2020/11/30/how-to-deploy-next.js-sites-to-netlify/)
- [AWS CDK](https://github.com/serverless-nextjs/serverless-next.js#readme)
