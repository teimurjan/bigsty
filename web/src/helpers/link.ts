export const getPageHref = (asPath: string) => {
  if (asPath.match(/^\/products\/\d+/)) {
    return '/products/[id]';
  }
  if (asPath.match(/^\/categories\/\d+\/products/)) {
    return '/categories/[id]/products';
  }
  
  return asPath;;
}