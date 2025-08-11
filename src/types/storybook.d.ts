declare module '@storybook/react' {
  // minimal definitions to satisfy TS without installing storybook
  export interface Meta<T> { title: string; component: T; }
  export interface StoryObj<T> {
    render?: () => JSX.Element;
    [key: string]: unknown;
  }
}
