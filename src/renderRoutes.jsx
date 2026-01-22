import { Route } from "react-router-dom";

export const renderRoutes = (routes) =>
  routes.map(({ path, element, children, index }, i) => {
    if (index) {
      return (
        <Route key={i} index element={element}>
          {children && renderRoutes(children)}
        </Route>
      );
    }

    return (
      <Route key={i} path={path} element={element}>
        {children && renderRoutes(children)}
      </Route>
    );
  });
