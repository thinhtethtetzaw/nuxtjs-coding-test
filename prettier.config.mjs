/** @type {import("prettier").Config} */
export default {
	useTabs: true,
	trailingComma: "all",
	endOfLine: "lf",
	quoteProps: "consistent",
	singleQuote: false,
	semi: false,
	plugins: ["prettier-plugin-organize-imports", "prettier-plugin-tailwindcss"],
}
