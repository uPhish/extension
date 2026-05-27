SOURCE CODE REVIEW

This archive contains the source code and the commands needed to rebuild the extension for review.

Build instructions (npm):

1. Install dependencies

   npm install

2. Build for Firefox

   npm run build:firefox

3. Create ZIPs

   npm run zip:firefox

Notes:
- If using pnpm or yarn, replace `npm` with `pnpm` or `yarn`.
- Remove any `.env` files that contain secrets before creating the sources ZIP, or include them only if necessary and safe.
- To verify the build inside the extracted sources ZIP, run the same build commands above. The output should match the build from the main project.
