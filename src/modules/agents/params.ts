import {createLoader, parseAsInteger, parseAsString } from "nuqs/server";

import { DEFAULT_PAGE } from "@/constant";

export const filtersSearcheParams = {
  search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
  page: parseAsInteger
    .withDefault(DEFAULT_PAGE)
    .withOptions({ clearOnDefault: true }),
};

export const loadSearchParams = createLoader(filtersSearcheParams);