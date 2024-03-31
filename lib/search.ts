import MiniSearch from "minisearch";
import { getAllArticleProperties } from "./articles";

export async function populateSearch() {
  const articles = await getAllArticleProperties();

  const miniSearch = new MiniSearch({
    fields: ["title", "description", "content"],
    storeFields: ["title", "name", "description"],
    idField: "name"
  });
  miniSearch.addAll(articles)
    
  return miniSearch;
}

export const miniSearch = populateSearch();