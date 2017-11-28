import marked from 'marked'
import { whitelistLink } from '/imports/api/lib/whitelistLink.js'

const markdownRenderer = new marked.Renderer()
markdownRenderer.link = (href, title, text) => whitelistLink(href, title, text)

export default markdownRenderer
