import { log,performanceLog } from '../utilities/logger';

let err = false;
export class SampleService {
    @performanceLog
    sum(a, b, callback) {
        if (err) {
            return callback(a - b, null,a/b);
        } else {
            return callback(null, a + b,a*b);
        }
    }
}
const e = new SampleService();
const result = e.sum(51, 6, function (err, res,arithmetic) {
    // Some logic on callback err/success...
});
