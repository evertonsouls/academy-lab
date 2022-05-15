import {  withPageAuthRequired } from "@auth0/nextjs-auth0";
import { getServerPageGetProducts, ssrGetProducts } from "../../graphql/generated/page";
import { withApollo } from "../../lib/withApollo";

function Home({ data }) {
  return (
    <div>
      <h1>Home</h1>
      <pre>{JSON.stringify(data.products, null, 2)}</pre>
      <a href="/api/auth/logout">Logout</a>
    </div>
  );
}

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async (ctx) => getServerPageGetProducts({}, ctx),
});


export default withApollo(
  ssrGetProducts.withPage()(Home)
)