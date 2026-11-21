import source from "../../data/catalog.json";
import { parseCatalog } from "./catalog";

export const catalog = parseCatalog(source);
