///<reference path="OeDataConfig.ts" />

module powerbi.visuals.sampleDataViews {

    interface Forecast {
        Guid: string;
        Name;
    }

    export interface ForecastVariable {
        Sector: string;
        Indicator: string;
        VariableData: number[];
    }

    export interface ScenarioForecastVariable extends ForecastVariable {
        ScenarioName: string;
    }

    export function GetOeDataSingleForecast(): JQueryPromise<ForecastVariable[]> {
        return GetOeData('82854664-837e-4dfb-b07a-1a86027c7319', ['UK', 'US', 'GERMANY', 'JAPAN'], ['GDP$']);
    }

    export function GetOeDataScenarios(): JQueryPromise<ScenarioForecastVariable[]> {
        return Get<Forecast[]>(`${oeData.OeBaseUrl}/forecasts`)
            .then(forecasts => {
                var promises = forecasts
                    .map(forecast => {
                        return GetOeData(forecast.Guid, ['CHINA'], ['GDP$'])
                            .then(fvs => fvs
                                .map(fv => {
                                    fv['ScenarioName'] = forecast.Name;
                                    return <ScenarioForecastVariable>fv;
                                })
                            );
                    });

                return AllPromises(promises);
            })
            .then(variables => {
                return _.flatten(variables);
            });
    }

    export function GetOeData(forecastId: string, locations: string[], indicators: string[]): JQueryPromise<ForecastVariable[]> {
        var url = `${oeData.OeBaseUrl}/${forecastId}/variables?locations=${locations.join(',')}&indicators=${indicators.join(',')}`;
        return Get<ForecastVariable[]>(url);
    }

    function Get<T>(url: string): JQueryPromise<T> {
        return $.ajax({
            type: 'GET',
            dataType: 'json',
            url: url,
            headers: {
                Authorization: `Bearer ${oeData.OeAuth0Token}`
            }
        });
    }

    function AllPromises<T>(promises: JQueryPromise<T>[]): JQueryPromise<T[]> {
        return $.when.apply($, promises)
            .then(function () {
                return Array.prototype.slice.call(arguments, 0);
            });
    }
}