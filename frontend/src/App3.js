
import React from "react";
import {
    ErrorBoundary,
    Facet,
    SearchProvider,
    SearchBox,
    Results,
    PagingInfo,
    ResultsPerPage,
    Paging,
    Sorting,
    WithSearch
} from "@elastic/react-search-ui";
import {
    BooleanFacet, Layout, SingleLinksFacet, SingleSelectFacet
} from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";
import {SearchDriverOptions} from "@elastic/search-ui";
import ElasticsearchAPIConnector from "@elastic/search-ui-elasticsearch-connector";

const connector = new ElasticsearchAPIConnector({
    host: "http://localhost:9200/",
    index: "transcription",
    // apiKey:""
});


const config = {
    searchQuery: {
        search_fields: {
            transcription: {
                weight: 3
            },
            accent: {},
            age: {},
            duration: {},
            gender: {},
        },
        result_fields: {
            transcription: {
                snippet: {}
            },
            accent: {
                snippet: {}
            },
            age: {
                snippet: {}
            },
            gender: {
                snippet: {}
            }

        },
        disjunctiveFacets: [
            "age.keyword",
            "gender.keyword",
            "accent.keyword"
        ],
        facets: {
            "age.keyword": { type: "value" },
            "gender.keyword": { type: "value" },
            "accent.keyword": { type: "value" },
            duration:{
                type: "range",
                ranges:[
                    { from: -1, name: "Any" },
                    { from: 0, to: 20, name: "1 to 20 second" },
                    { from: 20.00001, to: 40, name: "20 to 40 second" },
                    { from: 40.00001, to: 60, name: "40 to 60 second" },
                    { from: 60.00001, to: 20, name: "More than 60" }
                ]
            }
        }
    },
    // autocompleteQuery: {
    //     results: {
    //         resultsPerPage: 5,
    //         search_fields: {
    //             "title.suggest": {
    //                 weight: 3
    //             }
    //         },
    //         result_fields: {
    //             title: {
    //                 snippet: {
    //                     size: 100,
    //                     fallback: true
    //                 }
    //             },
    //             url: {
    //                 raw: {}
    //             }
    //         }
    //     },
    //     suggestions: {
    //         types: {
    //             results: { fields: ["movie_completion"] }
    //         },
    //         size: 4
    //     }
    // },
    apiConnector: connector,
    alwaysSearchOnInitialLoad: true
};
export default function App() {
    return (
        <SearchProvider config={config}>
            <WithSearch mapContextToProps={({ wasSearched }) => ({ wasSearched })}>
                {({ wasSearched }) => {
                    return (
                        <div className="App">
                            <ErrorBoundary>
                                <Layout
                                    header={
                                        <SearchBox
                                            // autocompleteMinimumCharacters={3}
                                            // autocompleteResults={{
                                            //     linkTarget: "_blank",
                                            //     sectionTitle: "Results",
                                            //     filenameField: "filename",
                                            //     ageField: "age",
                                            //     durationField: "duration",
                                            //     accentField: "accent",
                                            // }}
                                            // autocompleteSuggestions={false}
                                            debounceLength={0}
                                        />
                                    }
                                    sideContent={
                                        <div>
                                            {wasSearched && (
                                                <Sorting label={"Sort by"} sortOptions={[]} />
                                            )}
                                            <Facet
                                                key={"1"}
                                                field="age.keyword"
                                                label="Age"
                                                filterType="any"
                                                isFilterable={true}
                                            />
                                            <Facet
                                                key={"2"}
                                                field="gender.keyword"
                                                label="Gender"
                                                filterType="any"
                                                isFilterable={true}
                                            />
                                            <Facet
                                                key={"3"}
                                                field="accent.keyword"
                                                label="Gender"
                                                filterType="any"
                                                isFilterable={true}
                                            />
                                            <Facet
                                                key={"4"}
                                                field="duration"
                                                label="Duration"
                                                // filterType="any"
                                                // isFilterable={true}
                                            />
                                        </div>
                                    }
                                    bodyContent={<Results shouldTrackClickThrough={true}/>}
                                    bodyHeader={
                                        <React.Fragment>
                                            {wasSearched && <PagingInfo/>}
                                            {wasSearched && <ResultsPerPage/>}
                                        </React.Fragment>
                                    }
                                    bodyFooter={<Paging/>}
                                />
                            </ErrorBoundary>
                        </div>
                    );
                }}
            </WithSearch>
        </SearchProvider>
    );
}