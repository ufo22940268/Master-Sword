export class JSONValidator {

    private readonly json: any;

    constructor(json: object) {
        this.json = json;
    }

    validate(path: string, expectValue: string): { match: boolean, value: string } {
        let paths = path.split('.')
        const value = paths.reduce((j, path) => {
            if (!j || j[path] == undefined) {
                return null
            }

            if (Array.isArray(j[path])) {
                return j[path][0]
            } else {
                return j[path]
            }
        }, this.json);
        return {match: value == null ? false : value == expectValue, value: value}
    }
}
