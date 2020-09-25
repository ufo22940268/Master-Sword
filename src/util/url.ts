import parse from 'url-parse'

export let getDomain = (url: string) => {
    return parse(url, true).hostname
}
