export default class StringUtil {
  public normalize(content: string): string {
    return content
      .trim()
      .normalize('NFD')
      .replace(/[^a-zA-Z]/g, '')
      .toLowerCase();
  }

  public likeMatch(name: string, query: string): boolean {
    return !!name.match(`${query}.*`);
  }
}
