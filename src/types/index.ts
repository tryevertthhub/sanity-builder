export interface BlogBlock {
  _type: "blogBlock";
  _key: string;
  title: string;
  content: any[]; // Portable Text content
}
