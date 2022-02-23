function requestUrlToString(r) {
    return `${r.protocol}://${r.host.join(".")}$/${r.path.join("/")}`;
}

function createSummary(summary) {
    return summary.run.executions.map((e) => {
        return JSON.stringify({
            "type": "newman_test",
            "collection_name": summary.collection.name,
            "name": e.item.name,
            "url": requestUrlToString(e.item.request.url),
            "method": e.item.request.method,
            "responseTime": e.response.responseTime,
            "responseCode": e.response.code,
            "error": e.assertions.map(a => a.error).some(x => x)
        })
    })
}

module.exports = function(newman, options) {
    newman.on('beforeDone', function(err, data) {
        if (err) { return; }

        newman.exports.push({
            name: '@npm_identt/newman-reporter-log',
            default: 'summary.log',
            path:  options.summaryJsonExport,
            content: createSummary(data.summary).join("\n")
        });
    });
};
