export const agregateOrderedMapToArray = <T, I>(
  items: { [key: number]: T },
  order: number[],
  itemModifier?: (item: T) => I,
) =>
  order.reduce((acc, key) => {
    if (items[key]) {
      return [...acc, itemModifier ? itemModifier(items[key]) : items[key]];
    }

    return acc;
  }, []);
