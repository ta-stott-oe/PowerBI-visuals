﻿/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved. 
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *   
 *  The above copyright notice and this permission notice shall be included in 
 *  all copies or substantial portions of the Software.
 *   
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

/// <reference path="../_references.ts"/>

module powerbitests {
    import CompiledDataViewMapping = powerbi.data.CompiledDataViewMapping;
    import CompiledDataViewRoleForMapping = powerbi.data.CompiledDataViewRoleForMapping;
    import CompiledSubtotalType = powerbi.data.CompiledSubtotalType;
    import DataView = powerbi.DataView;
    import DataViewTable = powerbi.DataViewTable;
    import DataViewMetadataColumn = powerbi.DataViewMetadataColumn;
    import Table = powerbi.visuals.Table;
    import tableCapabilities = powerbi.visuals.tableCapabilities;
    import TableDataViewObjects = powerbi.visuals.TableDataViewObjects;
    import TableHierarchyNavigator = powerbi.visuals.TableHierarchyNavigator;
    import valueFormatter = powerbi.visuals.valueFormatter;
    import ValueType = powerbi.ValueType;
    import PrimitiveType = powerbi.PrimitiveType;

    powerbitests.mocks.setLocale();

    var dataTypeNumber = ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double);
    var dataTypeString = ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text);
    var dataTypeWebUrl = ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text, "WebUrl");
    var dataTypeKpiStatus = ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Integer);

    var groupSource1: DataViewMetadataColumn = { displayName: "group1", queryName: "group1", type: dataTypeString, index: 0 };
    var groupSource2: DataViewMetadataColumn = { displayName: "group2", queryName: "group2", type: dataTypeString, index: 1 };
    var groupSource3: DataViewMetadataColumn = { displayName: "group3", queryName: "group3", type: dataTypeString, index: 2 };
    var groupSourceWebUrl: DataViewMetadataColumn = { displayName: "groupWebUrl", queryName: "groupWebUrl", type: dataTypeWebUrl, index: 0 };
    var groupSourceKpiStatus: DataViewMetadataColumn = {
        displayName: "Average of Grade",
        queryName: "Table1._Average of Grade Status",
        type: dataTypeKpiStatus,
        roles: { Values: true },
        format: "g",
        kpiStatusGraphic: "Traffic Light - Single",
        objects: {
            general: {
                formatString: "g",
            },
        },
    };
  
    var measureSource1: DataViewMetadataColumn = { displayName: "measure1", queryName: "measure1", type: dataTypeNumber, isMeasure: true, index: 3, objects: { general: { formatString: "#.0" } } };
    var measureSource2: DataViewMetadataColumn = { displayName: "measure2", queryName: "measure2", type: dataTypeNumber, isMeasure: true, index: 4, objects: { general: { formatString: "#.00" } } };
    var measureSource3: DataViewMetadataColumn = { displayName: "measure3", queryName: "measure3", type: dataTypeNumber, isMeasure: true, index: 5, objects: { general: { formatString: "#" } } };

    var webPluginService = new powerbi.visuals.visualPluginFactory.MinervaVisualPluginService({});

    var tableTotals: TableDataViewObjects = {
        general: {
            totals: true,
            autoSizeColumnWidth: true,
        }
    };

    var tableNoTotals: TableDataViewObjects = {
        general: {
            totals: false,
            autoSizeColumnWidth: true,
        }
    };

    var tableColumnWidthFalse: TableDataViewObjects = {
        general: {
            totals: true,
            autoSizeColumnWidth: false,
        }
    };

    var tableColumnWidthTrue: TableDataViewObjects = {
        general: {
            totals: true,
            autoSizeColumnWidth: true,
        }
    };

    var dataViewTableThreeMeasures: DataViewTable = {
        columns: [measureSource1, measureSource2, measureSource3],
        rows: [
            [100, 10100, 102000],
            [103, 104000, 1050000],
            [106, 1070000, 10800000]
        ]
    };

    var tableOneMeasure: DataView = {
        metadata: { columns: [measureSource1] },
        table: {
            columns: [measureSource1],
            rows: [
                [100]
            ]
        }
    };

    var dataViewTableOneGroup: DataViewTable = {
        columns: [groupSource1],
        rows: [
            ["A"],
            ["B"],
            ["C"]
        ]
    };

    var tableOneGroup: DataView = {
        metadata: { columns: [groupSource1] },
        table: dataViewTableOneGroup
    };

    var tableOneGroupNulls: DataView = {
        metadata: { columns: [groupSource1] },
        table: {
            columns: [groupSource1],
            rows: [
                [""],
                [null]
            ]
        }
    };

    var dataViewTableTwoGroups: DataViewTable = {
        columns: [groupSource1, groupSource2],
        rows: [
            ["A", "a1"],
            ["A", "a2"],
            ["A", "a3"],
            ["B", "a1"],
            ["B", "a2"],
            ["C", "c1"],
            ["C", "c2"]
        ]
    };

    var tableTwoGroups: DataView = {
        metadata: { columns: [groupSource1, groupSource2] },
        table: dataViewTableTwoGroups
    };

    var tableTwoGroupsThreeMeasures: DataView = {
        metadata: {
            columns: [groupSource1, groupSource2, measureSource1, measureSource2, measureSource3],
            objects: tableTotals
        },
        table: {
            columns: [groupSource1, groupSource2, measureSource1, measureSource2, measureSource3],
            rows: [
                ["A", "a1", 100, 101, 102],
                ["A", "a2", 103, 104, 105],
                ["A", "a3", 106, 107, 108],
                ["B", "a1", 109, 110, 111],
                ["B", "a2", 112, 113, 114],
                ["C", "c1", 115, 116, 117],
                ["C", "c2", 118, 119, 120]
            ],
            totals: [null, null, 763, 770, 777]
        }
    };

    var tableTwoGroups1MeasureNulls: DataView = {
        metadata: {
            columns: [groupSource1, groupSource2, measureSource1]
        },
        table: {
            columns: [groupSource1, groupSource2, measureSource1],
            rows: [
                ["A", "a1", 100],
                ["", null, 103],
                ["", "a3", 106],
                ["B", "", 112],
                [null, "", null]
            ]
        }
    };

    var tableThreeGroupsThreeMeasuresInterleaved: DataView = {
        metadata: { columns: [groupSource1, measureSource1, groupSource2, measureSource2, groupSource3, measureSource3] },
        table: {
            columns: [groupSource1, measureSource1, groupSource2, measureSource2, groupSource3, measureSource3],
            rows: [
                ["A", 100, "aa", 101, "aa1", 102],
                ["A", 103, "aa", 104, "aa2", 105],
                ["A", 106, "ab", 107, "ab1", 108],
                ["B", 109, "ba", 110, "ba1", 111],
                ["B", 112, "bb", 113, "bb1", 114],
                ["B", 115, "bb", 116, "bb2", 117],
                ["C", 118, "cc", 119, "cc1", 120]
            ]
        }
    };

    var tableOneMeasureOneGroupSubtotals: DataView = {
        metadata: {
            columns: [measureSource1, groupSource1],
            objects: tableTotals
        },
        table: {
            columns: [measureSource1, groupSource1],
            rows: [
                [1, "A"],
                [2, "B"],
                [3, "C"]
            ],
            totals: [6, null]
        }
    };

    var tableOneMeasureOneGroupColumnWidthDefault: DataView = {
        metadata: {
            columns: [measureSource1, groupSource1],
            objects: tableColumnWidthFalse
        },
        table: {
            columns: [measureSource1, groupSource1],
            rows: [
                [1, "A"],
                [2, "B"],
                [3, "C"]
            ],
            totals: [6, null]
        }
    };

    var tableOneMeasureOneGroupColumnWidthTrue: DataView = {
        metadata: {
            columns: [measureSource1, groupSource1],
            objects: tableColumnWidthTrue
        },
        table: {
            columns: [measureSource1, groupSource1],
            rows: [
                [1, "A"],
                [2, "B"],
                [3, "C"]
            ],
            totals: [6, null]
        }
    };

    var tableOneMeasureOneGroup: DataView = {
        metadata: {
            columns: [measureSource1, groupSource1],
            objects: tableNoTotals
        },
        table: {
            columns: [measureSource1, groupSource1],
            rows: [
                [1, "A"],
                [2, "B"],
                [3, "C"]
            ]
        }
    };

    var tableWebUrl: DataView = {
        metadata: {
            columns: [groupSourceWebUrl],
            objects: tableNoTotals
        },
        table: {
            columns: [groupSourceWebUrl],
            rows: [
                ["http://www.microsoft.com"],
                ["data:url"],
                ["https://www.microsoft.com/2"]
            ]
        }
    };

    var tableKpi: DataView = {
        metadata: {
            columns: [groupSourceKpiStatus],
        },
        table: {
            columns: [groupSourceKpiStatus],
            rows: [
                ["-1"],
                ["0"],
                ["+1"],
            ]
        }
    };

    describe("Table", () => {
        it("Table registered capabilities", () => {
            expect(webPluginService.getPlugin("table").capabilities).toEqual(tableCapabilities);
        });

        it("Capabilities should include dataViewMappings", () => {
            expect(tableCapabilities.dataViewMappings).toBeDefined();
        });

        it("Capabilities should include dataRoles", () => {
            expect(tableCapabilities.dataRoles).toBeDefined();
        });

        it("Capabilities should suppressDefaultTitle", () => {
            expect(tableCapabilities.suppressDefaultTitle).toBe(true);
        });

        it("FormatString property should match calculated", () => {
            expect(powerbi.data.DataViewObjectDescriptors.findFormatString(tableCapabilities.objects)).toEqual(Table.formatStringProp);
        });

        it("CustomizeQuery picks up enabled total", () => {
            var dataViewMapping = createCompiledDataViewMapping(tableTotals);

            Table.customizeQuery({
                dataViewMappings: [dataViewMapping]
            });

            var rows = <CompiledDataViewRoleForMapping>dataViewMapping.table.rows;
            expect(rows.for.in.subtotalType).toEqual(CompiledSubtotalType.Before);
        });

        it("CustomizeQuery picks up disabled total", () => {
            var dataViewMapping = createCompiledDataViewMapping(tableNoTotals);

            powerbi.visuals.Table.customizeQuery({
                dataViewMappings: [dataViewMapping]
            });

            var rows = <CompiledDataViewRoleForMapping>dataViewMapping.table.rows;
            expect(rows.for.in.subtotalType).toEqual(CompiledSubtotalType.None);
        });

        it("CustomizeQuery handles missing settings", () => {
            var dataViewMapping = createCompiledDataViewMapping();

            Table.customizeQuery({
                dataViewMappings: [dataViewMapping]
            });

            // Total should be enabled by default
            var rows = <CompiledDataViewRoleForMapping>dataViewMapping.table.rows;
            expect(rows.for.in.subtotalType).toEqual(CompiledSubtotalType.Before);
        });

        it("CustomizeQuery handles missing subtotal settings", () => {
            var objects: TableDataViewObjects = {
                general: {
                    totals: undefined,
                    autoSizeColumnWidth: true,
                }
            };
            var dataViewMapping = createCompiledDataViewMapping(objects);

            Table.customizeQuery({
                dataViewMappings: [dataViewMapping]
            });

            // Total should be enabled by default
            var rows = <CompiledDataViewRoleForMapping>dataViewMapping.table.rows;
            expect(rows.for.in.subtotalType).toEqual(CompiledSubtotalType.Before);
        });

        function createCompiledDataViewMapping(objects?: TableDataViewObjects): CompiledDataViewMapping {
            return {
                metadata: {
                    objects: objects
                },
                table: {
                    rows: {
                        for: {
                            in: { role: "Values", items: [] }
                        }
                    }
                }
            };
        }
    });

    describe("Table hierarchy navigator tests", () => {
        function createNavigator(dataView: DataView): TableHierarchyNavigator {
            return new TableHierarchyNavigator(dataView.table, valueFormatter.formatRaw);
        }

        describe("getDepth", () => {
            var dataView = tableTwoGroupsThreeMeasures;
            var navigator = createNavigator(dataView);

            it("returns 1 for row dimension", () => {
                expect(navigator.getDepth(dataView.table.rows)).toBe(1);
            });

            it("returns 1 for column dimension", () => {
                expect(navigator.getDepth(dataView.table.columns)).toBe(1);
            });

            it("always returns 1", () => {
                expect(navigator.getDepth(null)).toBe(1);
            });
        });

        describe("getLeafCount", () => {
            var dataView = tableThreeGroupsThreeMeasuresInterleaved;
            var navigator = createNavigator(dataView);

            it("returns the row count for row dimension", () => {
                expect(navigator.getLeafCount(dataView.table.rows)).toBe(7);
            });

            it("returns the column count for column dimension", () => {
                expect(navigator.getLeafCount(dataView.table.columns)).toBe(6);
            });
        });

        describe("getLeafAt", () => {

            it("returns the correct leaf from the row dimension", () => {
                var dataView = tableTwoGroupsThreeMeasures;
                var navigator = createNavigator(dataView);
                var rows = dataView.table.rows;

                expect(navigator.getLeafAt(rows, 0)).toBe(rows[0]);
                expect(navigator.getLeafAt(rows, 1)).toBe(rows[1]);
                expect(navigator.getLeafAt(rows, 6)).toBe(rows[6]);
            });

            it("returns the correct leaf from the column dimension", () => {
                var dataView = tableThreeGroupsThreeMeasuresInterleaved;
                var navigator = createNavigator(dataView);
                var columns = dataView.table.columns;

                expect(navigator.getLeafAt(columns, 0)).toBe(columns[0]);
                expect(navigator.getLeafAt(columns, 1)).toBe(columns[1]);
                expect(navigator.getLeafAt(columns, 5)).toBe(columns[5]);
            });

            it("returns undefined if index is out of bounds in the row dimension", () => {
                var dataView = tableOneMeasure;
                var navigator = createNavigator(dataView);
                var rows = dataView.table.rows;

                expect(navigator.getLeafAt(rows, 1)).not.toBeDefined();
            });

            it("returns undefined if index is out of bounds in the column dimension", () => {
                var dataView = tableOneMeasure;
                var navigator = createNavigator(dataView);
                var columns = dataView.table.columns;

                expect(navigator.getLeafAt(columns, 1)).not.toBeDefined();
            });
        });

        describe("getParent", () => {
            var dataView = tableTwoGroupsThreeMeasures;
            var navigator = createNavigator(dataView);

            it("returns null for column header", () => {
                expect(navigator.getParent(dataView.table.columns[0])).toBeNull();
            });

            it("returns null for row", () => {
                expect(navigator.getParent(dataView.table.rows[0])).toBeNull();
            });

            it("returns null in any other cases", () => {
                expect(navigator.getParent(null)).toBeNull();
            });
        });

        describe("getIndex", () => {

            it("returns the correct index for columns", () => {
                var dataView = tableThreeGroupsThreeMeasuresInterleaved;
                var navigator = createNavigator(dataView);
                var columns = dataView.table.columns;

                expect(navigator.getIndex(columns[0])).toBe(0);
                expect(navigator.getIndex(columns[1])).toBe(1);
                expect(navigator.getIndex(columns[2])).toBe(2);
                expect(navigator.getIndex(columns[3])).toBe(3);
                expect(navigator.getIndex(columns[4])).toBe(4);
                expect(navigator.getIndex(columns[5])).toBe(5);
            });

            it("returns the correct index for rows", () => {
                var dataView = tableTwoGroupsThreeMeasures;
                var navigator = createNavigator(dataView);
                var rows = dataView.table.rows;
                var row1 = { index: 0, values: rows[0] };
                var row2 = { index: 1, values: rows[1] };

                expect(navigator.getIndex(row1)).toBe(0);
                expect(navigator.getIndex(row2)).toBe(1);
            });

            it("returns -1 if cannot find column in the collection", () => {
                var dataView = tableTwoGroups;
                var navigator = createNavigator(dataView);
                var columnInAnotherTable = tableThreeGroupsThreeMeasuresInterleaved.table.columns[4];

                expect(navigator.getIndex(columnInAnotherTable)).toBe(-1);
            });

            it("returns -1 if it is null", () => {
                var dataView = tableTwoGroups;
                var navigator = createNavigator(dataView);

                expect(navigator.getIndex(null)).toBe(-1);
            });
        });
        describe("isLeaf", () => {

            it("returns true for columns", () => {
                var dataView = tableThreeGroupsThreeMeasuresInterleaved;
                var navigator = createNavigator(dataView);
                var columns = dataView.table.columns;

                expect(navigator.isLeaf(columns[0])).toBeTruthy();
                expect(navigator.isLeaf(columns[1])).toBeTruthy();
                expect(navigator.isLeaf(columns[2])).toBeTruthy();
                expect(navigator.isLeaf(columns[3])).toBeTruthy();
                expect(navigator.isLeaf(columns[4])).toBeTruthy();
                expect(navigator.isLeaf(columns[5])).toBeTruthy();
            });

            it("returns true for rows", () => {
                var dataView = tableTwoGroupsThreeMeasures;
                var navigator = createNavigator(dataView);
                var rows = dataView.table.rows;

                expect(navigator.isLeaf(rows[0])).toBeTruthy();
                expect(navigator.isLeaf(rows[1])).toBeTruthy();
                expect(navigator.isLeaf(rows[2])).toBeTruthy();
                expect(navigator.isLeaf(rows[3])).toBeTruthy();
                expect(navigator.isLeaf(rows[4])).toBeTruthy();
                expect(navigator.isLeaf(rows[5])).toBeTruthy();
                expect(navigator.isLeaf(rows[6])).toBeTruthy();
            });
        });

        describe("getChildren", () => {

            it("returns null for column", () => {
                var dataView = tableTwoGroupsThreeMeasures;
                var navigator = createNavigator(dataView);
                var column = dataView.table.columns[3];

                expect(navigator.getChildren(column)).toBeNull();
            });

            it("returns null for row", () => {
                var dataView = tableThreeGroupsThreeMeasuresInterleaved;
                var navigator = createNavigator(dataView);
                var row = dataView.table.rows[4];

                expect(navigator.getChildren(row)).toBeNull();
            });
        });

        describe("getCount", () => {
            var dataView = tableThreeGroupsThreeMeasuresInterleaved;
            var navigator = createNavigator(dataView);

            it("returns the number of the columns for column dimension", () => {
                expect(navigator.getCount(dataView.table.columns)).toBe(dataView.table.columns.length);
            });

            it("returns the number of the rows for row dimension", () => {
                expect(navigator.getCount(dataView.table.rows)).toBe(dataView.table.rows.length);
            });
        });

        describe("getAt", () => {

            it("returns the correct item from the row dimension", () => {
                var dataView = tableTwoGroupsThreeMeasures;
                var navigator = createNavigator(dataView);
                var rows = dataView.table.rows;

                expect(navigator.getAt(rows, 0)).toBe(rows[0]);
                expect(navigator.getAt(rows, 1)).toBe(rows[1]);
                expect(navigator.getAt(rows, 6)).toBe(rows[6]);
            });

            it("returns the correct item from the column dimension", () => {
                var dataView = tableThreeGroupsThreeMeasuresInterleaved;
                var navigator = createNavigator(dataView);
                var columns = dataView.table.columns;

                expect(navigator.getAt(columns, 0)).toBe(columns[0]);
                expect(navigator.getAt(columns, 1)).toBe(columns[1]);
                expect(navigator.getAt(columns, 5)).toBe(columns[5]);
            });

            it("returns undefined if index is out of bounds in the row dimension", () => {
                var dataView = tableOneMeasure;
                var navigator = createNavigator(dataView);

                expect(navigator.getAt(dataView.table.rows, 1)).not.toBeDefined();
            });

            it("returns undefined if index is out of bounds in the column dimension", () => {
                var dataView = tableOneMeasure;
                var navigator = createNavigator(dataView);

                expect(navigator.getAt(dataView.table.columns, 1)).not.toBeDefined();
            });
        });

        describe("getLevel", () => {
            var dataView = tableThreeGroupsThreeMeasuresInterleaved;
            var navigator = createNavigator(dataView);

            it("returns 0 for column", () => {
                expect(navigator.getLevel(dataView.table.columns[1])).toBe(0);
            });

            it("returns 0 for row", () => {
                expect(navigator.getLevel(dataView.table.rows[5])).toBe(0);
            });
        });

        describe("getIntersection", () => {
            it("returns values in the intersection", () => {
                var dataView = tableThreeGroupsThreeMeasuresInterleaved;
                var visualTable = powerbi.visuals.Table.converter(dataView.table);
                var rows = visualTable.visualRows;
                var columns = dataView.table.columns;
                var navigator = new TableHierarchyNavigator(visualTable, valueFormatter.formatRaw);

                var expectedValues: string[][] = [
                    ["A", "100.0", "aa", "101.00", "aa1", "102"],
                    ["A", "103.0", "aa", "104.00", "aa2", "105"],
                    ["A", "106.0", "ab", "107.00", "ab1", "108"],
                    ["B", "109.0", "ba", "110.00", "ba1", "111"],
                    ["B", "112.0", "bb", "113.00", "bb1", "114"],
                    ["B", "115.0", "bb", "116.00", "bb2", "117"],
                    ["C", "118.0", "cc", "119.00", "cc1", "120"]
                ];

                expect(fillResult<string>(navigator, rows, columns, "textContent")).toEqual(expectedValues);
            });

            it("returns weburl values", () => {
                var dataView = tableWebUrl;
                var visualTable = powerbi.visuals.Table.converter(dataView.table);
                var rows = visualTable.visualRows;
                var columns = dataView.table.columns;
                var navigator = new TableHierarchyNavigator(visualTable, valueFormatter.formatRaw);

                var expectedValues: boolean[][] = [
                    [true],
                    [false],
                    [true]
                ];

                expect(fillResult<boolean>(navigator, rows, columns, "showUrl")).toEqual(expectedValues);
            });

            it("returns Kpi Markup", () => {
                var dataView = tableKpi;
                var visualTable = powerbi.visuals.Table.converter(dataView.table);
                var rows = visualTable.visualRows;
                var columns = dataView.table.columns;
                var navigator = new TableHierarchyNavigator(visualTable, valueFormatter.formatRaw);

                var expectedValues: string[][] = [
                    ['<div class="kpiTrafficLightSingle0" style="display: inline-block, vertical-align: sub"></div>'],
                    ['<div class="kpiTrafficLightSingle1" style="display: inline-block, vertical-align: sub"></div>'],
                    ['<div class="kpiTrafficLightSingle2" style="display: inline-block, vertical-align: sub"></div>'],
                ];

                expect(fillResult<string>(navigator, rows, columns, "domContent")).toEqual(expectedValues);
            });

            function fillResult<T>(
                navigator: TableHierarchyNavigator,
                rows: powerbi.visuals.DataViewVisualTableRow[],
                columns: DataViewMetadataColumn[],
                property: string): T[][] {

                var result: T[][] = [];

                for (var i = 0, ilen = rows.length; i < ilen; i++) {
                    result[i] = [];
                    for (var j = 0, jlen = columns.length; j < jlen; j++) {
                        let propertyValue = result[i][j] = navigator.getIntersection(rows[i], columns[j])[property];
                        if (propertyValue instanceof jQuery)
                            result[i][j] = propertyValue[0].outerHTML;
                        }
                }

                return result;
            }
        });

        describe("getCorner", () => {

            it("always returns null", () => {
                var dataView = tableThreeGroupsThreeMeasuresInterleaved;
                var navigator = createNavigator(dataView);

                expect(navigator.getCorner(0, 0)).toBeNull();
                expect(navigator.getCorner(10, 0)).toBeNull();
                expect(navigator.getCorner(0, 10)).toBeNull();
                expect(navigator.getCorner(10, 10)).toBeNull();
            });
        });

        describe("headerItemEquals", () => {

            it("returns true if the two items are the same", () => {
                var dataView = tableThreeGroupsThreeMeasuresInterleaved;
                var row = dataView.table.rows[0];
                var column = dataView.table.columns[0];
                var navigator = createNavigator(dataView);

                expect(navigator.headerItemEquals(row, row)).toBeTruthy();
                expect(navigator.headerItemEquals(column, column)).toBeTruthy();
            });

            it("returns false if the two items are not same", () => {
                var dataView = tableThreeGroupsThreeMeasuresInterleaved;
                var navigator = createNavigator(dataView);

                expect(navigator.headerItemEquals({ displayName: "a" }, { displayName: "a" })).toBeTruthy();
            });
            it("returns true for rows with index", () => {
                var dataView = tableThreeGroupsThreeMeasuresInterleaved;
                var navigator = createNavigator(dataView);

                expect(navigator.headerItemEquals({ index: 1, values: [] }, { index: 1, values: [] })).toBeTruthy();
            });
            it("returns false if the two items are not same", () => {
                var dataView = tableThreeGroupsThreeMeasuresInterleaved;
                var row = dataView.table.rows[0];
                var column = dataView.table.columns[0];
                var navigator = createNavigator(dataView);

                expect(navigator.headerItemEquals(row, column)).toBeFalsy();
                expect(navigator.headerItemEquals(column, row)).toBeFalsy();
            });
            it("returns false detects rows with index", () => {
                var dataView = tableThreeGroupsThreeMeasuresInterleaved;
                var navigator = createNavigator(dataView);

                expect(navigator.headerItemEquals({ index: 1 }, { index: 2 })).toBeFalsy();
            });

        });

        describe("bodyCellItemEquals", () => {

            it("returns true if the two items are the same", () => {
                var dataView = tableThreeGroupsThreeMeasuresInterleaved;
                var cell1 = dataView.table.rows[0][3];
                var navigator = createNavigator(dataView);

                expect(navigator.bodyCellItemEquals(cell1, cell1)).toBeTruthy();
            });

            it("returns false if the two items are not same", () => {
                var dataView = tableThreeGroupsThreeMeasuresInterleaved;
                var cell1 = dataView.table.rows[1][3];
                var cell2 = dataView.table.rows[2][3];
                var navigator = createNavigator(dataView);

                expect(navigator.bodyCellItemEquals(cell1, cell2)).toBeFalsy();
            });
        });
    });

    describe("Table logic", () => {
        var v: powerbi.IVisual,
            element: JQuery;

        beforeEach(() => {
            element = powerbitests.helpers.testDom("500", "500");
            element["visible"] = () => { return true; };
            v = webPluginService.getPlugin("table").create();
            v.init({
                element: element,
                host: powerbitests.mocks.createVisualHostServices(),
                style: powerbi.visuals.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true },
                interactivity: {
                    selection: true
                }
            });
        });

        it("loadMoreData calls control refresh", () => {
            var nav = { update() { } };
            var control = { refresh() { }, rowDimension: {}, updateModels(resetScrollOffsets: boolean, rowModel?: any, columnModel?: any) { } };
            var navSpy = spyOn(nav, "update");
            var controlSpy = spyOn(control, "refresh");
            v["hierarchyNavigator"] = nav;
            v["tablixControl"] = control;

            v.onDataChanged({
                dataViews: [tableOneGroup],
                operationKind: powerbi.VisualDataChangeOperationKind.Append
            });

            expect(navSpy).toHaveBeenCalled();
            expect(controlSpy).toHaveBeenCalled();
        });

        it("needsMoreData waitingForData", () => {
            v.onDataChanged({
                dataViews: [{
                    metadata: { columns: [groupSource1], segment: {} },
                    table: dataViewTableOneGroup
                }]
            });

            v["waitingForData"] = true;
            var tableVisual: Table = <Table>v;
            var lastRow = dataViewTableOneGroup.rows[2];
            var result = tableVisual.needsMoreData(lastRow);

            expect(result).toBe(false);
        });

        it("needsMoreData segmentComplete", () => {

            v.onDataChanged({
                dataViews: [{
                    metadata: { columns: [groupSource1] },
                    table: dataViewTableOneGroup
                }]
            });

            var tableVisual: Table = <Table>v;
            var lastRow = dataViewTableOneGroup.rows[2];
            var result = tableVisual.needsMoreData(lastRow);

            expect(result).toBe(false);
        });

        it("needsMoreData belowThreshold", () => {

            var table = dataViewTableTwoGroups;

            v.onDataChanged({
                dataViews: [{
                    metadata: { columns: [groupSource1, groupSource2], segment: {} },
                    table: table
                }]
            });

            var tableVisual: Table = <Table>v;
            var lastRow = table.rows[3];
            var result = tableVisual.needsMoreData(lastRow);

            expect(result).toBe(false);
        });

        it("needsMoreData aboveThreshold", () => {

            var table = dataViewTableTwoGroups;

            v.onDataChanged({
                dataViews: [{
                    metadata: { columns: [groupSource1, groupSource2], segment: {} },
                    table: table
                }]
            });

            var tableVisual: Table = <Table>v;
            var lastRow = { index: 6, values: table.rows[6] };
            var result = tableVisual.needsMoreData(lastRow);

            expect(result).toBe(true);
        });

        it("bindRowHeader callback", () => {

            var callBackCalled = false;
            var binderOptions = {
                onBindRowHeader: () => { callBackCalled = true; },
                layoutKind: powerbi.visuals.controls.TablixLayoutKind.Canvas
            };

            var binder = new powerbi.visuals.TableBinder(binderOptions);
            binder.bindRowHeader({ name: null }, {
                type: null, item: null, colSpan: 0, rowSpan: 0, textAlign: "",
                extension: { setContainerStyle: () => { } }
            });

            expect(callBackCalled).toBe(true);
        });

        it("enumerateObjectInstances empty data view", () => {
            v.onDataChanged({ dataViews: [] });

            // Note: this must not throw an exception
            expect(v.enumerateObjectInstances({ objectName: "general" })).toEqual([]);
        });

        it("enumerateObjectInstances general totals on", () => {
            v.onDataChanged({ dataViews: [tableOneMeasureOneGroupSubtotals] });

            expect(v.enumerateObjectInstances({ objectName: "general" })).toEqual([{
                selector: null,
                objectName: "general",
                properties: {
                    totals: true,
                    autoSizeColumnWidth: true,
                }
            }]);
        });

        it("enumerateObjectInstances general totals off", () => {
            v.onDataChanged({ dataViews: [tableOneMeasureOneGroup] });

            expect(v.enumerateObjectInstances({ objectName: "general" })).toEqual([{
                selector: null,
                objectName: "general",
                properties: {
                    totals: false,
                    autoSizeColumnWidth: true,
                }
            }]);
        });

        it("enumerateObjectInstances general no objects", () => {
            var dataView: DataView = {
                metadata: {
                    columns: [measureSource1, groupSource1]
                },
                table: {
                    columns: [measureSource1, groupSource1],
                    rows: [
                        [1, "A"],
                        [2, "B"],
                        [3, "C"]
                    ],
                    totals: [6, null]
                }
            };
            v.onDataChanged({ dataViews: [dataView] });

            expect(v.enumerateObjectInstances({ objectName: "general" })).toEqual([{
                selector: null,
                objectName: "general",
                properties: {
                    totals: true,
                    autoSizeColumnWidth: true
                }
            }]);
        });

        it("enumerateObjectInstances some other object", () => {
            v.onDataChanged({ dataViews: [tableOneMeasureOneGroup] });

            var objects = v.enumerateObjectInstances({ objectName: "some other object" });
            expect(objects).toEqual([]);
        });

        it("enumerateObjectInstances general autoSizeColumnWidth off", () => {
            v.onDataChanged({ dataViews: [tableOneMeasureOneGroupColumnWidthDefault] });

            expect(v.enumerateObjectInstances({ objectName: "general" })).toEqual([{
                selector: null,
                objectName: "general",
                properties: {
                    totals: true,
                    autoSizeColumnWidth: false
                }
            }]);
        });

        it("enumerateObjectInstances general autoSizeColumnWidth on", () => {
            v.onDataChanged({ dataViews: [tableOneMeasureOneGroupColumnWidthTrue] });

            expect(v.enumerateObjectInstances({ objectName: "general" })).toEqual([{
                selector: null,
                objectName: "general",
                properties: {
                    totals: true,
                    autoSizeColumnWidth: true
                }
            }]);
        });

        it("RefreshControl invisible parent", () => {
            var control = { refresh() { } };
            var controlSpy = spyOn(control, "refresh");
            v["shouldAllowHeaderResize"] = () => { return true; };
            v["hierarchyNavigator"] = { update() { } };
            v["tablixControl"] = control;
            v["element"]["visible"] = () => { return false; };

            v.onResizing({ width: 100, height: 100 });

            expect(controlSpy).not.toHaveBeenCalled();
        });

        it("RefreshControl invisible parent but dashboard layout", () => {
            var control = { refresh() { } };
            var controlSpy = spyOn(control, "refresh");
            v["shouldAllowHeaderResize"] = () => { return true; };
            v["hierarchyNavigator"] = { update() { } };
            v["tablixControl"] = control;
            v["element"]["visible"] = () => { return false; };
            v["isInteractive"] = false;

            v.onResizing({ width: 100, height: 100 });

            expect(controlSpy).toHaveBeenCalled();
        });

        it("ShouldClearControl noSort", (done) => {
            v.onDataChanged({ dataViews: [tableOneGroup] });
            var refreshSpy = spyOn(v, "refreshControl").and.callFake(() => { });

            v.onDataChanged({ dataViews: [tableOneGroup] });
            setTimeout(() => {
                expect(refreshSpy).toHaveBeenCalledWith(true);
                done();
            }, DefaultWaitForRender);
        });

        it("ShouldClearControl sort", (done) => {
            v.onDataChanged({ dataViews: [tableOneGroup] });
            var refreshSpy = spyOn(v, "refreshControl").and.callFake(() => { });
            v["waitingForSort"] = true;
            v.onDataChanged({ dataViews: [tableOneGroup] });

            setTimeout(() => {
                expect(refreshSpy).toHaveBeenCalledWith(false);
                done();
            }, DefaultWaitForRender);
        });

        it("ColumnWidthChangedCallback AutoSizeProperty on", (done) => {
            let dataViewObjects: TableDataViewObjects = {
                general: {
                    totals: true,
                    autoSizeColumnWidth: true,
                }
            };
            let dataView: DataView = {
                metadata: {
                    columns: [measureSource1, measureSource2, measureSource3],
                    objects: dataViewObjects
                },
                table: dataViewTableThreeMeasures
            };
            v.onDataChanged({ dataViews: [dataView] });
            setTimeout(() => {
                let tableVisual = <Table>v;
                tableVisual.columnWidthChanged(2, 45);
                let colWidthManager = tableVisual.getColumnWidthManager();
                let persistedColWidths = colWidthManager.getTablixColumnWidthsObject();
                expect(persistedColWidths.length).toBe(1);
                expect(persistedColWidths[0].queryName).toBe('measure2');
                expect(persistedColWidths[0].width).toBe(45);
                done();
            }, DefaultWaitForRender);
        });

        xit("ColumnWidthChangedCallback AutoSizeProperty off", (done) => {
            let dataViewObjects: TableDataViewObjects = {
                general: {
                    totals: true,
                    autoSizeColumnWidth: false,
                }
            };
            let dataView: DataView = {
                metadata: {
                    columns: [measureSource1, measureSource2, measureSource3],
                    objects: dataViewObjects
                },
                table: dataViewTableThreeMeasures
            };
            v.onDataChanged({ dataViews: [dataView] });
            setTimeout(() => {
                v.onDataChanged({ dataViews: [dataView] });
                setTimeout(() => {
                    let tableVisual = <Table>v;
                    let colWidthManager = tableVisual.getColumnWidthManager();
                    let persistedColWidths = colWidthManager.getTablixColumnWidthsObject();
                    expect(persistedColWidths.length).toBe(3);
                    expect(persistedColWidths[0].queryName).toBe(measureSource1.queryName);
                    expect(persistedColWidths[0].width).toBe(68);
                    expect(persistedColWidths[1].queryName).toBe(measureSource2.queryName);
                    expect(persistedColWidths[1].width).toBe(73);
                    expect(persistedColWidths[2].queryName).toBe(measureSource3.queryName);
                    expect(persistedColWidths[2].width).toBe(71);
                    done();
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });

        xit("ColumnWidthChangedCallback AutoSizeProperty off then resize", (done) => {
            let dataViewObjects: TableDataViewObjects = {
                general: {
                    totals: true,
                    autoSizeColumnWidth: false,
                }
            };
            let dataView: DataView = {
                metadata: {
                    columns: [measureSource1, measureSource2, measureSource3],
                    objects: dataViewObjects
                },
                table: dataViewTableThreeMeasures
            };
            v.onDataChanged({ dataViews: [dataView] });
            setTimeout(() => {
                v.onDataChanged({ dataViews: [dataView] });
                setTimeout(() => {
                    let tableVisual = <Table>v;
                    tableVisual.columnWidthChanged(2, 45);
                    let colWidthManager = tableVisual.getColumnWidthManager();
                    let persistedColWidths = colWidthManager.getTablixColumnWidthsObject();
                    expect(persistedColWidths.length).toBe(3);
                    expect(persistedColWidths[0].queryName).toBe(measureSource1.queryName);
                    expect(persistedColWidths[0].width).toBe(68);
                    expect(persistedColWidths[1].queryName).toBe(measureSource2.queryName);
                    expect(persistedColWidths[1].width).toBe(45);
                    expect(persistedColWidths[2].queryName).toBe(measureSource3.queryName);
                    expect(persistedColWidths[2].width).toBe(71);
                    done();
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });
    });

    describe("Table DOM validation", () => {
        var v: powerbi.IVisual,
            element: JQuery,
            NoMarginClass = "bi-tablix-cellNoMarginStyle",
            ColumnHeaderClassName = "bi-table-column-header",
            RowClassName = "bi-table-row",
            LastRowClassName = "bi-table-last-row",
            FooterClassName = "bi-table-footer",
            NumericCellClassName = " bi-table-cell-numeric",
            EmptyHeaderCell = "\xa0";

        beforeEach(() => {

            groupSource1.index = 0;
            groupSource2.index = 1;
            groupSource3.index = 2;
            measureSource1.index = 3;
            measureSource2.index = 4;
            measureSource3.index = 5;
        });

        beforeEach(() => {
            element = powerbitests.helpers.testDom("500", "500");
            element["visible"] = () => { return true; };
            v = webPluginService.getPlugin("table").create();
            v.init({
                element: element,
                host: powerbitests.mocks.createVisualHostServices(),
                style: powerbi.visuals.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true },
                interactivity: {
                    selection: true
                }
            });
        });

        function validateTable(expectedValues: string[][]): void {
            tablixHelper.validateTable(expectedValues, ".bi-tablix tr");
        }

        function validateClassNames(expectedValues: string[][]): void {
            tablixHelper.validateClassNames(expectedValues, ".bi-tablix tr", NoMarginClass);
        }

        xit("resize with autoSizeColumnwidth on", (done) => {
            let selector = ".bi-tablix tr";
            let dataViewObjects: TableDataViewObjects = {
                general: {
                    totals: true,
                    autoSizeColumnWidth: true,
                }
            };
            let dataView: DataView = {
                metadata: {
                    columns: [measureSource1, measureSource2, measureSource3],
                    objects: dataViewObjects
                },
                table: dataViewTableThreeMeasures
            };
            v.onDataChanged({ dataViews: [dataView] });
            setTimeout(() => {
                let rows = $(selector);
                let rowCells = rows.eq(0).find('td');
                expect(rowCells.eq(1).width()).toEqual(69);
                expect(rowCells.eq(2).width()).toEqual(74);
                expect(rowCells.eq(3).width()).toEqual(72);
                // Mock Resize
                var newMeasureSource2: DataViewMetadataColumn = { displayName: "measure2", queryName: "measure2", type: dataTypeNumber, isMeasure: true, index: 4, objects: { general: { formatString: "#.00", columnWidth: 45 } } };
                let dataView2: DataView = {
                    metadata: {
                        columns: [measureSource1, newMeasureSource2, measureSource3],
                        objects: dataViewObjects
                    },
                    table: dataViewTableThreeMeasures
                };
                v.onDataChanged({ dataViews: [dataView2] });
                setTimeout(() => {
                    let newRows = $(selector);
                    let newRowCells = newRows.eq(0).find('td');
                    expect(newRowCells.eq(1).width()).toEqual(69);
                    expect(newRowCells.eq(2).width()).toEqual(46);
                    expect(newRowCells.eq(3).width()).toEqual(72);
                    done();
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });

        xit("autoSizeColumnwidth on to off then resize", (done) => {
            let selector = ".bi-tablix tr";
            let dataView: DataView = {
                metadata: {
                    columns: [measureSource1, measureSource2, measureSource3],
                    objects: tableColumnWidthFalse
                },
                table: dataViewTableThreeMeasures
            };
            v.onDataChanged({ dataViews: [dataView] });
            setTimeout(() => {
                let rows = $(selector);
                let rowCells = rows.eq(0).find('td');
                expect(rowCells.eq(1).width()).toEqual(69);
                expect(rowCells.eq(2).width()).toEqual(74);
                expect(rowCells.eq(3).width()).toEqual(72);
                                                       
                // Mock Resize
                let newMeasureSource2: DataViewMetadataColumn = { displayName: "measure2", queryName: "measure2", type: dataTypeNumber, isMeasure: true, index: 4, objects: { general: { formatString: "#.00", columnWidth: 45 } } };
                let dataView2: DataView = {
                    metadata: {
                        columns: [measureSource1, newMeasureSource2, measureSource3],
                        objects: tableColumnWidthFalse
                    },
                    table: dataViewTableThreeMeasures
                };
                let tableVisual = <Table>v;
                let colwidthManager = tableVisual.getColumnWidthManager();
                // Overriding suppress notification. For test purposes the call needs to go through
                colwidthManager.suppressOnDataChangedNotification = false;
                colwidthManager.updateDataView(dataView2);
                v.onDataChanged({ dataViews: [dataView2] });
                setTimeout(() => {
                    let newRows = $(selector);
                    let newRowCells = newRows.eq(0).find('td');
                    expect(newRowCells.eq(1).width()).toEqual(69);
                    expect(newRowCells.eq(2).width()).toEqual(46);
                    expect(newRowCells.eq(3).width()).toEqual(72);
                    done();
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });

        xit("autoSizeColumnwidth off to on", (done) => {
            let selector = ".bi-tablix tr";
            let dataViewObjects: TableDataViewObjects = {
                general: {
                    totals: true,
                    autoSizeColumnWidth: false,
                }
            };
            let newMeasureSource2: DataViewMetadataColumn = { displayName: "measure2", queryName: "measure2", type: dataTypeNumber, isMeasure: true, index: 4, objects: { general: { formatString: "#.00", columnWidth: 45 } } };
            let dataView0: DataView = {
                metadata: {
                    columns: [measureSource1, newMeasureSource2, measureSource3],
                    objects: dataViewObjects
                },
                table: dataViewTableThreeMeasures
            };
            // AutoSize property off
            v.onDataChanged({ dataViews: [dataView0] });
            setTimeout(() => {
                let rows = $(selector);
                let rowCells = rows.eq(0).find('td');
                expect(rowCells.eq(1).width()).toEqual(69);
                expect(rowCells.eq(2).width()).toEqual(46);
                expect(rowCells.eq(3).width()).toEqual(72);
                // AutoSize property on
                let dataViewObjects1: TableDataViewObjects = {
                    general: {
                        totals: true,
                        autoSizeColumnWidth: true,
                    }
                };
                let dataView1: DataView = {
                    metadata: {
                        columns: [measureSource1, measureSource2, measureSource3],
                        objects: dataViewObjects1
                    },
                    table: dataViewTableThreeMeasures
                };
                let tableVisual = <Table>v;
                let colwidthManager = tableVisual.getColumnWidthManager();
                // Overriding suppress notification. For test purposes the call needs to go through
                colwidthManager.suppressOnDataChangedNotification = false;
                colwidthManager.updateDataView(dataView1);
                v.onDataChanged({ dataViews: [dataView1] });
                setTimeout(() => {
                    let rows = $(selector);
                    let rowCells = rows.eq(0).find('td');
                    expect(rowCells.eq(1).width()).toEqual(69);
                    expect(rowCells.eq(2).width()).toEqual(74);
                    expect(rowCells.eq(3).width()).toEqual(72);
                    done();
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });

        it("1x2 table (one measure)", (done) => {

            var dataView = tableOneMeasure;
            v.onDataChanged({ dataViews: [dataView] });

            setTimeout(() => {

                var cellValue: string = formatter(dataView.table.rows[0][0], measureSource1);
                var expectedCells: string[][] = [
                    ["", measureSource1.displayName, ""],
                    ["", cellValue]
                ];

                validateTable(expectedCells);

                var expectedClassNames: string[][] = [
                    ["", ColumnHeaderClassName + NumericCellClassName, ""],
                    ["", LastRowClassName + NumericCellClassName]
                ];

                validateClassNames(expectedClassNames);

                done();
            }, DefaultWaitForRender);
        });

        it("1x2 table (one group null)", (done) => {

            var dataView = tableOneGroupNulls;
            v.onDataChanged({ dataViews: [dataView] });

            setTimeout(() => {
                var expectedCells: string[][] = [
                    ["", groupSource1.displayName, ""],
                    [EmptyHeaderCell, ""],
                    [EmptyHeaderCell, ""]
                ];

                validateTable(expectedCells);
                done();
            }, DefaultWaitForRender);
        });

        it("3x5 table (2 groups 1 measure nulls)", (done) => {

            var dataView = tableTwoGroups1MeasureNulls;
            v.onDataChanged({ dataViews: [dataView] });

            setTimeout(() => {
                var expectedCells: string[][] = [
                    ["", groupSource1.displayName, groupSource2.displayName, measureSource1.displayName, ""],
                    ["", "A", "a1", "100.0"],
                    ["", "", "", "103.0"],
                    ["", "", "a3", "106.0"],
                    ["", "B", "", "112.0"],
                    [EmptyHeaderCell, "", "", ""]
                ];

                validateTable(expectedCells);
                done();
            }, DefaultWaitForRender);
        });

        it("1x3 table (group instances)", (done) => {

            var dataView = tableOneGroup;
            v.onDataChanged({ dataViews: [dataView] });

            setTimeout(() => {

                var cellValue1: string = formatter(dataView.table.rows[0][0], groupSource1);
                var cellValue2: string = formatter(dataView.table.rows[1][0], groupSource1);
                var cellValue3: string = formatter(dataView.table.rows[2][0], groupSource1);
                var expectedCells: string[][] = [
                    ["", groupSource1.displayName, ""],
                    ["", cellValue1],
                    ["", cellValue2],
                    ["", cellValue3]
                ];

                validateTable(expectedCells);

                var expectedClassNames: string[][] = [
                    ["", ColumnHeaderClassName, ""],
                    ["", RowClassName],
                    ["", RowClassName],
                    ["", LastRowClassName]
                ];

                validateClassNames(expectedClassNames);

                done();
            }, DefaultWaitForRender);
        });

        it("2x8 table (group instances)", (done) => {

            var dataView = tableTwoGroups;
            v.onDataChanged({ dataViews: [dataView] });

            setTimeout(() => {

                var cellValue1: string = formatter(dataView.table.rows[0][0], groupSource1);
                var cellValue2: string = formatter(dataView.table.rows[1][0], groupSource1);
                var cellValue3: string = formatter(dataView.table.rows[2][0], groupSource1);
                var cellValue4: string = formatter(dataView.table.rows[3][0], groupSource1);
                var cellValue5: string = formatter(dataView.table.rows[4][0], groupSource1);
                var cellValue6: string = formatter(dataView.table.rows[5][0], groupSource1);
                var cellValue7: string = formatter(dataView.table.rows[6][0], groupSource1);
                var cellValue8: string = formatter(dataView.table.rows[0][1], groupSource2);
                var cellValue9: string = formatter(dataView.table.rows[1][1], groupSource2);
                var cellValue10: string = formatter(dataView.table.rows[2][1], groupSource2);
                var cellValue11: string = formatter(dataView.table.rows[3][1], groupSource2);
                var cellValue12: string = formatter(dataView.table.rows[4][1], groupSource2);
                var cellValue13: string = formatter(dataView.table.rows[5][1], groupSource2);
                var cellValue14: string = formatter(dataView.table.rows[6][1], groupSource2);

                var expectedCells: string[][] = [
                    ["", groupSource1.displayName, groupSource2.displayName, ""],
                    ["", cellValue1, cellValue8],
                    ["", cellValue2, cellValue9],
                    ["", cellValue3, cellValue10],
                    ["", cellValue4, cellValue11],
                    ["", cellValue5, cellValue12],
                    ["", cellValue6, cellValue13],
                    ["", cellValue7, cellValue14]
                ];

                validateTable(expectedCells);

                done();
            }, DefaultWaitForRender);
        });

        it("5x9 table (group instances and measure values) with totals", (done) => {
            var dataView = tableTwoGroupsThreeMeasures;
            measureSource1.index = 2;
            measureSource2.index = 3;
            measureSource3.index = 4;

            v.onDataChanged({ dataViews: [dataView] });

            setTimeout(() => {

                var cellValue1: string = formatter(dataView.table.rows[0][2], measureSource1);
                var cellValue2: string = formatter(dataView.table.rows[1][2], measureSource1);
                var cellValue3: string = formatter(dataView.table.rows[2][2], measureSource1);
                var cellValue4: string = formatter(dataView.table.rows[3][2], measureSource1);
                var cellValue5: string = formatter(dataView.table.rows[4][2], measureSource1);
                var cellValue6: string = formatter(dataView.table.rows[5][2], measureSource1);
                var cellValue7: string = formatter(dataView.table.rows[6][2], measureSource1);
                var cellValue8: string = formatter(dataView.table.rows[0][3], measureSource2);
                var cellValue9: string = formatter(dataView.table.rows[1][3], measureSource2);
                var cellValue10: string = formatter(dataView.table.rows[2][3], measureSource2);
                var cellValue11: string = formatter(dataView.table.rows[3][3], measureSource2);
                var cellValue12: string = formatter(dataView.table.rows[4][3], measureSource2);
                var cellValue13: string = formatter(dataView.table.rows[5][3], measureSource2);
                var cellValue14: string = formatter(dataView.table.rows[6][3], measureSource2);
                var cellValue15: string = formatter(dataView.table.rows[0][4], measureSource3);
                var cellValue16: string = formatter(dataView.table.rows[1][4], measureSource3);
                var cellValue17: string = formatter(dataView.table.rows[2][4], measureSource3);
                var cellValue18: string = formatter(dataView.table.rows[3][4], measureSource3);
                var cellValue19: string = formatter(dataView.table.rows[4][4], measureSource3);
                var cellValue20: string = formatter(dataView.table.rows[5][4], measureSource3);
                var cellValue21: string = formatter(dataView.table.rows[6][4], measureSource3);

                var total1: string = formatter(dataView.table.totals[2], measureSource1);
                var total2: string = formatter(dataView.table.totals[3], measureSource2);
                var total3: string = formatter(dataView.table.totals[4], measureSource3);

                var expectedCells: string[][] = [
                    ["", groupSource1.displayName, groupSource2.displayName, measureSource1.displayName, measureSource2.displayName, measureSource3.displayName, ""],
                    ["", dataView.table.rows[0][0], dataView.table.rows[0][1], cellValue1, cellValue8, cellValue15],
                    ["", dataView.table.rows[1][0], dataView.table.rows[1][1], cellValue2, cellValue9, cellValue16],
                    ["", dataView.table.rows[2][0], dataView.table.rows[2][1], cellValue3, cellValue10, cellValue17],
                    ["", dataView.table.rows[3][0], dataView.table.rows[3][1], cellValue4, cellValue11, cellValue18],
                    ["", dataView.table.rows[4][0], dataView.table.rows[4][1], cellValue5, cellValue12, cellValue19],
                    ["", dataView.table.rows[5][0], dataView.table.rows[5][1], cellValue6, cellValue13, cellValue20],
                    ["", dataView.table.rows[6][0], dataView.table.rows[6][1], cellValue7, cellValue14, cellValue21],
                    ["", "Total", "", total1, total2, total3, ""]
                ];

                validateTable(expectedCells);

                var expectedClassNames: string[][] = [
                    ["", ColumnHeaderClassName, ColumnHeaderClassName, ColumnHeaderClassName + NumericCellClassName, ColumnHeaderClassName + NumericCellClassName, ColumnHeaderClassName + NumericCellClassName, ""],
                    ["", RowClassName, RowClassName, RowClassName + NumericCellClassName, RowClassName + NumericCellClassName, RowClassName + NumericCellClassName],
                    ["", RowClassName, RowClassName, RowClassName + NumericCellClassName, RowClassName + NumericCellClassName, RowClassName + NumericCellClassName],
                    ["", RowClassName, RowClassName, RowClassName + NumericCellClassName, RowClassName + NumericCellClassName, RowClassName + NumericCellClassName],
                    ["", RowClassName, RowClassName, RowClassName + NumericCellClassName, RowClassName + NumericCellClassName, RowClassName + NumericCellClassName],
                    ["", RowClassName, RowClassName, RowClassName + NumericCellClassName, RowClassName + NumericCellClassName, RowClassName + NumericCellClassName],
                    ["", RowClassName, RowClassName, RowClassName + NumericCellClassName, RowClassName + NumericCellClassName, RowClassName + NumericCellClassName],
                    ["", LastRowClassName, LastRowClassName, LastRowClassName + NumericCellClassName, LastRowClassName + NumericCellClassName, LastRowClassName + NumericCellClassName],
                    ["", FooterClassName, FooterClassName, FooterClassName + NumericCellClassName, FooterClassName + NumericCellClassName, FooterClassName + NumericCellClassName, ""]
                ];

                validateClassNames(expectedClassNames);

                done();
            }, DefaultWaitForRender);
        });

        it("2x5 table (group instances and measure values) with totals, total value comes first", (done) => {

            var dataView = tableOneMeasureOneGroupSubtotals;
            measureSource1.index = 0;
            groupSource1.index = 1;

            v.onDataChanged({ dataViews: [dataView] });

            setTimeout(() => {

                var cellValue1: string = formatter(dataView.table.rows[0][0], measureSource1);
                var cellValue2: string = formatter(dataView.table.rows[1][0], measureSource1);
                var cellValue3: string = formatter(dataView.table.rows[2][0], measureSource1);

                var total: string = formatter(dataView.table.totals[0], measureSource1);

                var expectedCells: string[][] = [
                    ["", measureSource1.displayName, groupSource1.displayName, ""],
                    ["", cellValue1, dataView.table.rows[0][1]],
                    ["", cellValue2, dataView.table.rows[1][1]],
                    ["", cellValue3, dataView.table.rows[2][1]],
                    ["", total, "", ""]
                ];

                validateTable(expectedCells);

                var expectedClassNames: string[][] = [
                    ["", ColumnHeaderClassName + NumericCellClassName, ColumnHeaderClassName, ""],
                    ["", RowClassName + NumericCellClassName, RowClassName],
                    ["", RowClassName + NumericCellClassName, RowClassName],
                    ["", LastRowClassName + NumericCellClassName, LastRowClassName],
                    ["", FooterClassName + NumericCellClassName, FooterClassName, ""]
                ];

                validateClassNames(expectedClassNames);

                done();
            }, DefaultWaitForRender);
        });

        it("2x5 table (group instances and measure values) totals on then off", (done) => {

            var dataView = tableOneMeasureOneGroupSubtotals;
            measureSource1.index = 0;
            groupSource1.index = 1;

            v.onDataChanged({ dataViews: [dataView] });

            setTimeout(() => {

                var cellValue1: string = formatter(dataView.table.rows[0][0], measureSource1);
                var cellValue2: string = formatter(dataView.table.rows[1][0], measureSource1);
                var cellValue3: string = formatter(dataView.table.rows[2][0], measureSource1);

                var total: string = formatter(dataView.table.totals[0], measureSource1);

                var expectedCells: string[][] = [
                    ["", measureSource1.displayName, groupSource1.displayName, ""],
                    ["", cellValue1, dataView.table.rows[0][1]],
                    ["", cellValue2, dataView.table.rows[1][1]],
                    ["", cellValue3, dataView.table.rows[2][1]],
                    ["", total, "", ""]
                ];

                validateTable(expectedCells);

                // Now update with totals off
                var dataViewNoTotal = tableOneMeasureOneGroup;

                v.onDataChanged({ dataViews: [dataViewNoTotal] });

                setTimeout(() => {

                    var expectedCellsNoTotal: string[][] = [
                        ["", measureSource1.displayName, groupSource1.displayName, ""],
                        ["", cellValue1, dataViewNoTotal.table.rows[0][1]],
                        ["", cellValue2, dataViewNoTotal.table.rows[1][1]],
                        ["", cellValue3, dataViewNoTotal.table.rows[2][1]]
                    ];

                    validateTable(expectedCellsNoTotal);

                    done();
                }, DefaultWaitForRender);

            }, DefaultWaitForRender);
        });

        it("1x3 table (group instances with WebUrl)", (done) => {
            var dataView = tableWebUrl;
            v.onDataChanged({ dataViews: [dataView] });

            setTimeout(() => {

                var cellValue1: string = formatter(dataView.table.rows[0][0], groupSourceWebUrl);
                var cellValue2: string = formatter(dataView.table.rows[1][0], groupSourceWebUrl);
                var cellValue3: string = formatter(dataView.table.rows[2][0], groupSourceWebUrl);
                var expectedCells: string[][] = [
                    ["", groupSourceWebUrl.displayName, ""],
                    ["", cellValue1],
                    ["", cellValue2],
                    ["", cellValue3]
                ];

                validateTable(expectedCells);

                var expectedClassNames: string[][] = [
                    ["", ColumnHeaderClassName, ""],
                    ["", RowClassName],
                    ["", RowClassName],
                    ["", LastRowClassName]
                ];

                validateClassNames(expectedClassNames);

                var expectedChildTags: string[][] = [
                    [undefined, undefined, undefined],
                    [undefined, "A"],
                    [undefined, undefined],
                    [undefined, "A"]
                ];

                validateChildTag(expectedChildTags, $(".bi-tablix tr"));

                done();
            }, DefaultWaitForRender);
        });

        it("1x3 table (group instances with Kpi)", (done) => {
            var dataView = tableKpi;
            v.onDataChanged({ dataViews: [dataView] });

            setTimeout(() => {
                var expectedCells: string[][] = [
                    ["", groupSourceKpiStatus.displayName, ""],
                    ["", ""],
                    ["", ""],
                    ["", ""]
                ];

                validateTable(expectedCells);

                var expectedClassNames: string[][] = [
                    ["", ColumnHeaderClassName, ""],
                    ["", RowClassName],
                    ["", RowClassName],
                    ["", LastRowClassName]
                ];

                validateClassNames(expectedClassNames);

                var expectedChildTags: string[][] = [
                    [undefined, undefined, undefined],
                    [undefined, ".kpiTrafficLightSingle0"],
                    [undefined, ".kpiTrafficLightSingle1"],
                    [undefined, ".kpiTrafficLightSingle2"]
                ];

                validateChildTag(expectedChildTags, $(".bi-tablix tr"));

                done();
            }, DefaultWaitForRender);
        });

        it("1x1 table loadMoreData", (done) => {

            var dataView: DataView = {
                metadata: { columns: [groupSource1], segment: {} },
                table: {
                    columns: [groupSource1],
                    rows: [
                        ["A"],
                        ["B"],
                        ["C"]
                    ]
                }
            };

            v.onDataChanged({
                dataViews: [dataView]
            });

            var segment2: DataView = {
                metadata: { columns: [groupSource1] },
                table: {
                    columns: [groupSource1],
                    rows: [
                        ["D"],
                        ["E"]
                    ]
                }
            };

            // Simulate a load more merge
            powerbi.data.segmentation.DataViewMerger.mergeTables(dataView.table, segment2.table);
            v.onDataChanged({
                dataViews: [dataView],
                operationKind: powerbi.VisualDataChangeOperationKind.Append
            });

            setTimeout(() => {

                var cellValue1: string = formatter(dataView.table.rows[0][0], groupSource1);
                var cellValue2: string = formatter(dataView.table.rows[1][0], groupSource1);
                var cellValue3: string = formatter(dataView.table.rows[2][0], groupSource1);
                var cellValue4: string = formatter(dataView.table.rows[3][0], groupSource1);
                var cellValue5: string = formatter(dataView.table.rows[4][0], groupSource1);
                var expectedCells: string[][] = [
                    ["", groupSource1.displayName, ""],
                    ["", cellValue1],
                    ["", cellValue2],
                    ["", cellValue3],
                    ["", cellValue4],
                    ["", cellValue5]
                ];

                validateTable(expectedCells);

                done();
            }, DefaultWaitForRender);
        });

        it("2x5 table reorder loadMoreData", (done) => {

            var dataView: DataView = {
                metadata: { columns: [groupSource1, groupSource2], segment: {} },
                table: {
                    columns: [groupSource1, groupSource2],
                    rows: [
                        ["A", "1"],
                        ["B", "2"],
                        ["C", "3"]
                    ]
                }
            };

            v.onDataChanged({
                dataViews: [dataView]
            });

            // Simulate column reordering
            v.onDataChanged({ dataViews: [applyTransform(dataView)] });

            var segment2: DataView = {
                metadata: { columns: [groupSource1] },
                table: {
                    columns: [groupSource1],
                    rows: [
                        ["D", "4"],
                        ["E", "5"]
                    ]
                }
            };

            // Simulate a load more merge
            powerbi.data.segmentation.DataViewMerger.mergeTables(dataView.table, segment2.table);

            v.onDataChanged({
                dataViews: [applyTransform(dataView)],
                operationKind: powerbi.VisualDataChangeOperationKind.Append
            });

            setTimeout(() => {

                var expectedCells: string[][] = [
                    ["", groupSource2.displayName, groupSource1.displayName, ""],
                    ["", "1", "A"],
                    ["", "2", "B"],
                    ["", "3", "C"],
                    ["", "4", "D"],
                    ["", "5", "E"]
                ];

                validateTable(expectedCells);

                done();
            }, DefaultWaitForRender);
        });

        function applyTransform(dataView: DataView): DataView {
            var transforms: powerbi.data.DataViewTransformActions = {
                selects: [
                    {
                        displayName: groupSource1.displayName,
                        type: powerbi.ValueType.fromDescriptor({ text: true })
                    }, {
                        displayName: groupSource2.displayName,
                        type: powerbi.ValueType.fromDescriptor({ text: true })
                    }
                ],
                projectionOrdering: {
                    Values: [1, 0]
                }
            };

            var transformedDataView = powerbi.data.DataViewTransform.apply(
                {
                    prototype: dataView,
                    objectDescriptors: null,
                    transforms: transforms,
                    dataViewMappings: powerbi.visuals.tableCapabilities.dataViewMappings,
                    colorAllocatorFactory: powerbi.visuals.createColorAllocatorFactory()
                })[0];

            return transformedDataView;
        }

    });

    function formatter(value: any, source: DataViewMetadataColumn): string {
        return valueFormatter.formatRaw(value, valueFormatter.getFormatString(source, Table.formatStringProp, false));
    }

    function validateChildTag(expectedChildTag: string[][], rows: JQuery): void {
        var result: string[][] = [];

        for (var i = 0, ilen = rows.length; i < ilen; i++) {
            result[i] = [];
            var cells = rows.eq(i).find("td");
            for (var j = 0, jlen = cells.length; j < jlen; j++) {
                var childTag = expectedChildTag[i][j];
                if (childTag) {
                    var child = cells.eq(j).find(childTag);
                    if (child.length > 0)
                        result[i][j] = childTag;
                    else
                        result[i][j] = undefined;
                }
                else
                    result[i][j] = undefined;
            }
        }

        expect(result).toEqual(expectedChildTag);
    }

    describe("Dashboard table DOM validation", () => {
        var v: powerbi.IVisual,
            element: JQuery,
            NoMarginClass = "bi-tablix-cellNoMarginStyle",
            ColumnHeaderClassName = "bi-table-column-header",
            RowClassName = "bi-table-row",
            LastRowClassName = "bi-table-last-row",
            FooterClassName = "bi-table-footer",
            NumericCellClassName = " bi-table-cell-numeric",
            EmptyHeaderCell = "\xa0",
            host = powerbitests.mocks.createVisualHostServices();

        beforeEach(() => {

            groupSource1.index = 0;
            groupSource2.index = 1;
            groupSource3.index = 2;
            measureSource1.index = 3;
            measureSource2.index = 4;
            measureSource3.index = 5;
        });

        beforeEach(() => {
            element = powerbitests.helpers.testDom("500", "500");
            element["visible"] = () => { return false; };
            v = webPluginService.getPlugin("table").create();
            v.init({
                element: element,
                host: host,
                style: powerbi.visuals.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true },
                interactivity: {
                    selection: null
                }
            });
        });

        function validateTable(expectedValues: string[][]): void {
            tablixHelper.validateTable(expectedValues, ".bi-dashboard-tablix tr");
        }

        function validateClassNames(expectedValues: string[][]): void {
            tablixHelper.validateClassNames(expectedValues, ".bi-dashboard-tablix tr", NoMarginClass);
        }

        it("1x2 table (one measure)", (done) => {
            v.onDataChanged({ dataViews: [tableOneMeasure] });

            setTimeout(() => {

                var cellValue: string = formatter(tableOneMeasure.table.rows[0][0], measureSource1);
                var expectedCells: string[][] = [
                    ["", measureSource1.displayName],
                    ["", cellValue]
                ];

                validateTable(expectedCells);

                var expectedClassNames: string[][] = [
                    ["", ColumnHeaderClassName + NumericCellClassName],
                    ["", LastRowClassName + NumericCellClassName]
                ];

                validateClassNames(expectedClassNames);

                done();
            }, DefaultWaitForRender);
        });

        it("1x2 table (one group null)", (done) => {
            v.onDataChanged({ dataViews: [tableOneGroupNulls] });

            setTimeout(() => {
                var expectedCells: string[][] = [
                    ["", groupSource1.displayName],
                    [EmptyHeaderCell, ""],
                    [EmptyHeaderCell, ""]
                ];

                validateTable(expectedCells);
                done();
            }, DefaultWaitForRender);
        });

        it("3x5 table (2 groups 1 measure nulls)", (done) => {
            v.onDataChanged({ dataViews: [tableTwoGroups1MeasureNulls] });

            setTimeout(() => {
                var expectedCells: string[][] = [
                    ["", groupSource1.displayName, groupSource2.displayName, measureSource1.displayName],
                    ["", "A", "a1", "100.0"],
                    ["", "", "", "103.0"],
                    ["", "", "a3", "106.0"],
                    ["", "B", "", "112.0"],
                    [EmptyHeaderCell, "", "", ""]
                ];

                validateTable(expectedCells);
                done();
            }, DefaultWaitForRender);
        });

        it("1x3 table (group instances)", (done) => {

            var dataView = tableOneGroup;
            v.onDataChanged({ dataViews: [dataView] });

            setTimeout(() => {

                var cellValue1: string = formatter(dataView.table.rows[0][0], groupSource1);
                var cellValue2: string = formatter(dataView.table.rows[1][0], groupSource1);
                var cellValue3: string = formatter(dataView.table.rows[2][0], groupSource1);
                var expectedCells: string[][] = [
                    ["", groupSource1.displayName],
                    ["", cellValue1],
                    ["", cellValue2],
                    ["", cellValue3]
                ];

                validateTable(expectedCells);

                var expectedClassNames: string[][] = [
                    ["", ColumnHeaderClassName],
                    ["", RowClassName],
                    ["", RowClassName],
                    ["", LastRowClassName]
                ];

                validateClassNames(expectedClassNames);

                done();
            }, DefaultWaitForRender);
        });

        it("2x8 table (group instances)", (done) => {

            var dataView = tableTwoGroups;
            v.onDataChanged({ dataViews: [dataView] });

            setTimeout(() => {

                var cellValue1: string = formatter(dataView.table.rows[0][0], groupSource1);
                var cellValue2: string = formatter(dataView.table.rows[1][0], groupSource1);
                var cellValue3: string = formatter(dataView.table.rows[2][0], groupSource1);
                var cellValue4: string = formatter(dataView.table.rows[3][0], groupSource1);
                var cellValue5: string = formatter(dataView.table.rows[4][0], groupSource1);
                var cellValue6: string = formatter(dataView.table.rows[5][0], groupSource1);
                var cellValue7: string = formatter(dataView.table.rows[6][0], groupSource1);
                var cellValue8: string = formatter(dataView.table.rows[0][1], groupSource2);
                var cellValue9: string = formatter(dataView.table.rows[1][1], groupSource2);
                var cellValue10: string = formatter(dataView.table.rows[2][1], groupSource2);
                var cellValue11: string = formatter(dataView.table.rows[3][1], groupSource2);
                var cellValue12: string = formatter(dataView.table.rows[4][1], groupSource2);
                var cellValue13: string = formatter(dataView.table.rows[5][1], groupSource2);
                var cellValue14: string = formatter(dataView.table.rows[6][1], groupSource2);

                var expectedCells: string[][] = [
                    ["", groupSource1.displayName, groupSource2.displayName],
                    ["", cellValue1, cellValue8],
                    ["", cellValue2, cellValue9],
                    ["", cellValue3, cellValue10],
                    ["", cellValue4, cellValue11],
                    ["", cellValue5, cellValue12],
                    ["", cellValue6, cellValue13],
                    ["", cellValue7, cellValue14]
                ];

                validateTable(expectedCells);

                done();
            }, DefaultWaitForRender);
        });

        it("5x9 table (group instances and measure values) with totals", (done) => {

            var dataView = tableTwoGroupsThreeMeasures;
            measureSource1.index = 2;
            measureSource2.index = 3;
            measureSource3.index = 4;

            v.onDataChanged({ dataViews: [dataView] });

            setTimeout(() => {

                var cellValue1: string = formatter(dataView.table.rows[0][2], measureSource1);
                var cellValue2: string = formatter(dataView.table.rows[1][2], measureSource1);
                var cellValue3: string = formatter(dataView.table.rows[2][2], measureSource1);
                var cellValue4: string = formatter(dataView.table.rows[3][2], measureSource1);
                var cellValue5: string = formatter(dataView.table.rows[4][2], measureSource1);
                var cellValue6: string = formatter(dataView.table.rows[5][2], measureSource1);
                var cellValue7: string = formatter(dataView.table.rows[6][2], measureSource1);
                var cellValue8: string = formatter(dataView.table.rows[0][3], measureSource2);
                var cellValue9: string = formatter(dataView.table.rows[1][3], measureSource2);
                var cellValue10: string = formatter(dataView.table.rows[2][3], measureSource2);
                var cellValue11: string = formatter(dataView.table.rows[3][3], measureSource2);
                var cellValue12: string = formatter(dataView.table.rows[4][3], measureSource2);
                var cellValue13: string = formatter(dataView.table.rows[5][3], measureSource2);
                var cellValue14: string = formatter(dataView.table.rows[6][3], measureSource2);
                var cellValue15: string = formatter(dataView.table.rows[0][4], measureSource3);
                var cellValue16: string = formatter(dataView.table.rows[1][4], measureSource3);
                var cellValue17: string = formatter(dataView.table.rows[2][4], measureSource3);
                var cellValue18: string = formatter(dataView.table.rows[3][4], measureSource3);
                var cellValue19: string = formatter(dataView.table.rows[4][4], measureSource3);
                var cellValue20: string = formatter(dataView.table.rows[5][4], measureSource3);
                var cellValue21: string = formatter(dataView.table.rows[6][4], measureSource3);

                var total1: string = formatter(dataView.table.totals[2], measureSource1);
                var total2: string = formatter(dataView.table.totals[3], measureSource2);
                var total3: string = formatter(dataView.table.totals[4], measureSource3);

                var expectedCells: string[][] = [
                    ["", groupSource1.displayName, groupSource2.displayName, measureSource1.displayName, measureSource2.displayName, measureSource3.displayName],
                    ["", dataView.table.rows[0][0], dataView.table.rows[0][1], cellValue1, cellValue8, cellValue15],
                    ["", dataView.table.rows[1][0], dataView.table.rows[1][1], cellValue2, cellValue9, cellValue16],
                    ["", dataView.table.rows[2][0], dataView.table.rows[2][1], cellValue3, cellValue10, cellValue17],
                    ["", dataView.table.rows[3][0], dataView.table.rows[3][1], cellValue4, cellValue11, cellValue18],
                    ["", dataView.table.rows[4][0], dataView.table.rows[4][1], cellValue5, cellValue12, cellValue19],
                    ["", dataView.table.rows[5][0], dataView.table.rows[5][1], cellValue6, cellValue13, cellValue20],
                    ["", dataView.table.rows[6][0], dataView.table.rows[6][1], cellValue7, cellValue14, cellValue21],
                    ["", "Total", "", total1, total2, total3]
                ];

                validateTable(expectedCells);

                var expectedClassNames: string[][] = [
                    ["", ColumnHeaderClassName, ColumnHeaderClassName, ColumnHeaderClassName + NumericCellClassName, ColumnHeaderClassName + NumericCellClassName, ColumnHeaderClassName + NumericCellClassName],
                    ["", RowClassName, RowClassName, RowClassName + NumericCellClassName, RowClassName + NumericCellClassName, RowClassName + NumericCellClassName],
                    ["", RowClassName, RowClassName, RowClassName + NumericCellClassName, RowClassName + NumericCellClassName, RowClassName + NumericCellClassName],
                    ["", RowClassName, RowClassName, RowClassName + NumericCellClassName, RowClassName + NumericCellClassName, RowClassName + NumericCellClassName],
                    ["", RowClassName, RowClassName, RowClassName + NumericCellClassName, RowClassName + NumericCellClassName, RowClassName + NumericCellClassName],
                    ["", RowClassName, RowClassName, RowClassName + NumericCellClassName, RowClassName + NumericCellClassName, RowClassName + NumericCellClassName],
                    ["", RowClassName, RowClassName, RowClassName + NumericCellClassName, RowClassName + NumericCellClassName, RowClassName + NumericCellClassName],
                    ["", LastRowClassName, LastRowClassName, LastRowClassName + NumericCellClassName, LastRowClassName + NumericCellClassName, LastRowClassName + NumericCellClassName],
                    ["", FooterClassName, FooterClassName, FooterClassName + NumericCellClassName, FooterClassName + NumericCellClassName, FooterClassName + NumericCellClassName]
                ];

                validateClassNames(expectedClassNames);

                done();
            }, DefaultWaitForRender);
        });

        it("2x5 table (group instances and measure values) with totals, total value comes first", (done) => {

            var dataView = tableOneMeasureOneGroupSubtotals;
            measureSource1.index = 0;
            groupSource1.index = 1;

            v.onDataChanged({ dataViews: [dataView] });

            setTimeout(() => {

                var cellValue1: string = formatter(dataView.table.rows[0][0], measureSource1);
                var cellValue2: string = formatter(dataView.table.rows[1][0], measureSource1);
                var cellValue3: string = formatter(dataView.table.rows[2][0], measureSource1);

                var total: string = formatter(dataView.table.totals[0], measureSource1);

                var expectedCells: string[][] = [
                    ["", measureSource1.displayName, groupSource1.displayName],
                    ["", cellValue1, dataView.table.rows[0][1]],
                    ["", cellValue2, dataView.table.rows[1][1]],
                    ["", cellValue3, dataView.table.rows[2][1]],
                    ["", total, ""]
                ];

                validateTable(expectedCells);

                var expectedClassNames: string[][] = [
                    ["", ColumnHeaderClassName + NumericCellClassName, ColumnHeaderClassName],
                    ["", RowClassName + NumericCellClassName, RowClassName],
                    ["", RowClassName + NumericCellClassName, RowClassName],
                    ["", LastRowClassName + NumericCellClassName, LastRowClassName],
                    ["", FooterClassName + NumericCellClassName, FooterClassName]
                ];

                validateClassNames(expectedClassNames);

                done();
            }, DefaultWaitForRender);
        });

        it("2x5 table (group instances and measure values) totals on then off", (done) => {

            var dataView = tableOneMeasureOneGroupSubtotals;
            measureSource1.index = 0;
            groupSource1.index = 1;

            v.onDataChanged({ dataViews: [dataView] });

            setTimeout(() => {

                var cellValue1: string = formatter(dataView.table.rows[0][0], measureSource1);
                var cellValue2: string = formatter(dataView.table.rows[1][0], measureSource1);
                var cellValue3: string = formatter(dataView.table.rows[2][0], measureSource1);

                var total: string = formatter(dataView.table.totals[0], measureSource1);

                var expectedCells: string[][] = [
                    ["", measureSource1.displayName, groupSource1.displayName],
                    ["", cellValue1, dataView.table.rows[0][1]],
                    ["", cellValue2, dataView.table.rows[1][1]],
                    ["", cellValue3, dataView.table.rows[2][1]],
                    ["", total, ""]
                ];

                validateTable(expectedCells);

                // Now update with totals off
                var dataViewNoTotal = tableOneMeasureOneGroup;

                v.onDataChanged({ dataViews: [dataViewNoTotal] });

                setTimeout(() => {

                    var expectedCellsNoTotal: string[][] = [
                        ["", measureSource1.displayName, groupSource1.displayName],
                        ["", cellValue1, dataViewNoTotal.table.rows[0][1]],
                        ["", cellValue2, dataViewNoTotal.table.rows[1][1]],
                        ["", cellValue3, dataViewNoTotal.table.rows[2][1]]
                    ];

                    validateTable(expectedCellsNoTotal);

                    done();
                }, DefaultWaitForRender);

            }, DefaultWaitForRender);
        });

        it("1x3 table (group instances with WebUrl)", (done) => {
            var dataView = tableWebUrl;
            v.onDataChanged({ dataViews: [dataView] });

            setTimeout(() => {

                var cellValue1: string = formatter(dataView.table.rows[0][0], groupSourceWebUrl);
                var cellValue2: string = formatter(dataView.table.rows[1][0], groupSourceWebUrl);
                var cellValue3: string = formatter(dataView.table.rows[2][0], groupSourceWebUrl);
                var expectedCells: string[][] = [
                    ["", groupSourceWebUrl.displayName],
                    ["", cellValue1],
                    ["", cellValue2],
                    ["", cellValue3]
                ];

                validateTable(expectedCells);

                var expectedClassNames: string[][] = [
                    ["", ColumnHeaderClassName],
                    ["", RowClassName],
                    ["", RowClassName],
                    ["", LastRowClassName]
                ];

                validateClassNames(expectedClassNames);

                var expectedChildTags: string[][] = [
                    [undefined, undefined],
                    [undefined, "A"],
                    [undefined, undefined],
                    [undefined, "A"]
                ];

                validateChildTag(expectedChildTags, $(".bi-dashboard-tablix tr"));

                done();
            }, DefaultWaitForRender);
        });
    });

    describe("Table sort validation", () => {
        var element: JQuery;

        beforeEach((done) => {
            element = powerbitests.helpers.testDom("800", "800");
            element["visible"] = () => { return true; };
            done();
        });

        it("table with single measure", (done) => {
            // Clicking on the measure will result in a sort event
            var data: DataView = tableOneMeasure;
            var expectedColumnHeaders = [{ row: 0, col: 1, expectedText: "measure1" }];
            var clicks = [{ row: 0, col: 1 }, { row: 1, col: 1 }];
            var expectedSorts = [
                [{ queryName: "measure1" }]
            ];
            tablixHelper.runTablixSortTest(element, done, "table", data, expectedColumnHeaders, clicks, expectedSorts);
        });

        it("table with single group", (done) => {
            // Clicking on the group header multiple times will result in multiple sort events.
            // Clicking on non-header cells will not result in sort events.
            var data: DataView = tableOneGroup;
            var expectedColumnHeaders = [{ row: 0, col: 1, expectedText: "group1" }];
            var clicks = [{ row: 0, col: 1 }, { row: 1, col: 1 }, { row: 2, col: 1 }, { row: 0, col: 1 }];
            var expectedSorts = [
                [{ queryName: "group1" }], [{ queryName: "group1" }]
            ];
            tablixHelper.runTablixSortTest(element, done, "table", data, expectedColumnHeaders, clicks, expectedSorts);
        });

        it("table with two groups", (done) => {
            // Clicking on different group headers multiple times results in a sort event for each click
            var data: DataView = tableTwoGroups;
            var expectedColumnHeaders = [{ row: 0, col: 1, expectedText: "group1" }, { row: 0, col: 2, expectedText: "group2" }];
            var clicks = [{ row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 1 }, { row: 0, col: 2 }];
            var expectedSorts = [
                [{ queryName: "group1" }], [{ queryName: "group2" }], [{ queryName: "group1" }], [{ queryName: "group2" }]
            ];
            tablixHelper.runTablixSortTest(element, done, "table", data, expectedColumnHeaders, clicks, expectedSorts);
        });

        it("table with two groups and three measures", (done) => {
            // Clicking on different group headers multiple times results in a sort event for each click
            var data: DataView = tableTwoGroupsThreeMeasures;
            var expectedColumnHeaders = [{ row: 0, col: 1, expectedText: "group1" }, { row: 0, col: 2, expectedText: "group2" }, { row: 0, col: 3, expectedText: "measure1" }, { row: 0, col: 4, expectedText: "measure2" }, { row: 0, col: 5, expectedText: "measure3" }];
            var clicks = [{ row: 0, col: 5 }, { row: 0, col: 2 }, { row: 0, col: 4 }, { row: 0, col: 1 }, { row: 0, col: 3 }, { row: 0, col: 1 }, { row: 0, col: 5 }];
            var expectedSorts = [
                [{ queryName: "measure3" }], [{ queryName: "group2" }], [{ queryName: "measure2" }], [{ queryName: "group1" }], [{ queryName: "measure1" }], [{ queryName: "group1" }], [{ queryName: "measure3" }]
            ];
            tablixHelper.runTablixSortTest(element, done, "table", data, expectedColumnHeaders, clicks, expectedSorts);
        });
    });
}