import {
  ActionReducerMap,
  createFeatureSelector
} from '@ngrx/store';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { AuthState } from './auth/auth.models';
import { authReducer } from './auth/auth.reducer';
import { RouterStateUrl } from './router/router.state';
import { settingsReducer } from './settings/settings.reducer';
import { SettingsState } from './settings/settings.model';
import { UserState } from './user/user.models';
import { userReducer } from './user/user.reducer';
import { AgrupationState } from './agrupation/agrupation.models';
import { agrupationReducer } from './agrupation/agrupation.reducer';
import { GeneralState } from './general/general.models';
import { generalReducer } from './general/general.reducer';
import { productFormReducer } from './product-form/product-form.reducer';
import { ProductFormState } from './product-form/product.models';
import {
  productsFilterReducer,
  ProductsFilterState
} from './products-filter/products-filter.reducer';
import { productListReducer, ProductListState } from './product-list/product-list.reducer';
import { cartReducer, CartState } from './cart/cart.reducer';
import { orderReducer, OrderState } from './order/order.reducer';

export const reducers: ActionReducerMap<AppState> = {
  general: generalReducer,
  auth: authReducer,
  settings: settingsReducer,
  router: routerReducer,
  profile: userReducer,
  agrupation: agrupationReducer,
  productForm: productFormReducer,
  productsFilter: productsFilterReducer,
  productList: productListReducer,
  cartList: cartReducer,
  orderList: orderReducer
};

export const selectGeneralState = createFeatureSelector<AppState, GeneralState>(
  'general'
);
export const selectAuthState = createFeatureSelector<AppState, AuthState>(
  'auth'
);
export const selectUserState = createFeatureSelector<AppState, UserState>(
  'profile'
);
export const selectAgrupationState = createFeatureSelector<AppState, AgrupationState>(
  'agrupation'
);
export const selectProductFormState = createFeatureSelector<AppState, ProductFormState>(
  'productForm'
);
export const selectProductListState = createFeatureSelector<ProductListState>(
  'productList'
);
export const selectCartState = createFeatureSelector<CartState>(
  'cartList'
);
export const selectOrderState = createFeatureSelector<OrderState>(
  'orderList'
);
export const selectProductsFilterState = createFeatureSelector<ProductsFilterState>(
  'productsFilter'
);
export const selectSettingsState = createFeatureSelector<AppState, SettingsState>(
  'settings'
);
export const selectRouterState = createFeatureSelector<AppState, RouterReducerState<RouterStateUrl>>(
  'router'
);

export interface AppState {
  general: GeneralState;
  auth: AuthState;
  profile: UserState;
  agrupation: AgrupationState;
  productForm: ProductFormState;
  productsFilter: ProductsFilterState;
  productList: ProductListState;
  orderList: OrderState;
  cartList: CartState;
  settings: SettingsState;
  router: RouterReducerState<RouterStateUrl>;
}
