import * as prettier from 'prettier';
import prettierHtmlParser from 'prettier/plugins/html';

export default async function getPrettiedCode(rawCode: string) {
  const prettiedHtml = await prettier.format(`<div>${rawCode}</div>`, {
    parser: 'html',
    plugins: [prettierHtmlParser],
  });
  return prettiedHtml;
}
