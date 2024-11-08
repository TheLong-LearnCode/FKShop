import React, { Suspense } from "react";
import UserLayout from "../layouts/User/UserLayout.jsx";
import LazyLoader from "../component/LazyLoader/index.jsx";

const HomePage = React.lazy(() => import("../page/user/home/HomePage.jsx"));
const AboutPage = React.lazy(() => import("../page/user/about"));
const AllProductsPage = React.lazy(() => import("../page/user/product/list/AllProduct.jsx"));
const ContactPage = React.lazy(() =>
  import("../page/user/contact/Contact.jsx")
);
const BlogPage = React.lazy(() => import("../page/user/blog/BlogPage.jsx"));
const BlogDetailsPage = React.lazy(() =>
  import("../page/user/blog/BlogDetails.jsx")
);
const FavoriteProductPage = React.lazy(() =>
  import("../page/user/favorite/FavoriteView.jsx")
);

//login và register dùng chung trang là login
const LoginPage = React.lazy(() => import("../page/auth/login"));
const RegisterPage = React.lazy(() => import("../page/auth/login"));
const ProductListPage = React.lazy(() =>
  import("../page/user/product/list/ProductByCate.jsx")
);
const ProductSearchPage = React.lazy(() =>
  import("../page/user/product/list/ProductByName.jsx")
);
const ProductCardPage = React.lazy(() =>
  import("../page/user/product/detail/ProductDetail")
);
const ProductCartPage = React.lazy(() =>
  import("../page/user/cart/ProductCart")
);

const UnauthorizedPage = React.lazy(() => import("../page/auth/unauthorized"));

const PublicRoutes = [
  {
    path: "/",
    element: <LazyLoader children={<UserLayout />} />,
    children: [
      {
        index: true,
        element: <LazyLoader children={<HomePage />} />,
      },
      {
        path: "home",
        element: <LazyLoader children={<HomePage />} />,
      },
      {
        path: "about",
        element: <LazyLoader children={<AboutPage />} />,
      },
      {
        path: "contact",
        element: <LazyLoader children={<ContactPage />} />,
      },
      {
        path: "blog",
        element: <LazyLoader children={<BlogPage />} />,
      },
      {
        path: "login",
        element: <LazyLoader children={<LoginPage />} />,
      },
      {
        path: "register",
        element: <LazyLoader children={<RegisterPage />} />,
      },

      //product
      {
        path: "all-products",
        element: <LazyLoader children={<AllProductsPage />} />,
      },
      {
        path: "products/:categoryID",
        element: <LazyLoader children={<ProductListPage />} />,
      },
      {
        path: "detail/:productID",
        element: <LazyLoader children={<ProductCardPage />} />,
      },
      {
        path: "cart",
        element: <LazyLoader children={<ProductCartPage />} />,
      },
      {
        path: "favorite",
        element: <LazyLoader children={<FavoriteProductPage />} />,
      },
      {
        path: "blog/:blogID",
        element: <LazyLoader children={<BlogDetailsPage />} />,
      },
      {
        path: "search",
        element: <LazyLoader children={<ProductSearchPage />} />,
      },
    ],
  },
  {
    path: "/unauthorized",
    element: (
        <Suspense fallback={null}>
          <UnauthorizedPage />
        </Suspense>
      ),
  },
];

export default PublicRoutes;
