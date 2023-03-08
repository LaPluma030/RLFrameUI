// 分页组件中，跳转至哪页的方法（hack方法，有更好的方法的话可以重写）
export function goToPage(pagination: { page: number }, pagesNumber: number, $event: string | number | null) {
  let page = typeof $event === "string" ? parseInt($event) : 1;
  if (isNaN(page)) {
    page = 1;
  }
  pagination.page = Math.max(1, Math.min(page, pagesNumber));
}
