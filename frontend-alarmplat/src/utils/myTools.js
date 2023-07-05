/*
获取匹配的最近的祖先元素
@param dom: Element
@param selector: String (css选择器)
@return dom: Element || null
*/
export const getFirstMatchParentEl = (dom, selector) => {
  let fmp = dom.parentElement
  while (fmp && !fmp.matches(selector)) {
    fmp = fmp.parentElement
  }
  return fmp
}
