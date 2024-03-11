import React from "react";
import "@elastic/eui/dist/eui_theme_light.css";

import ElasticsearchAPIConnector from "@elastic/search-ui-elasticsearch-connector";
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
  Layout,

} from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";

const connector = new ElasticsearchAPIConnector({
  host: "http://ec2-3-27-34-117.ap-southeast-2.compute.amazonaws.com:9200/",
  index: "transcription",
  // apiKey:"Qk9oVEtJNEJKZWVNWnhFQ1NSTVk6Sko4THRWTHZTZWVmdW5vXzYyUThFZw=="
});

// const connector = new ElasticSearchAPIConnector({
//   host:
//       process.env.REACT_ELASTICSEARCH_HOST ||
//       "https://search-ui-sandbox.es.us-central1.gcp.cloud.es.io:9243",
//   index: process.env.REACT_ELASTICSEARCH_INDEX || "national-parks",
//   apiKey:
//       process.env.REACT_ELASTICSEARCH_API_KEY ||
//       "SlUzdWE0QUJmN3VmYVF2Q0F6c0I6TklyWHFIZ3lTbHF6Yzc2eEtyeWFNdw=="
// });

const config = {
  debug: true,
  // alwaysSearchOnInitialLoad: true,
  apiConnector: connector,
  // hasA11yNotifications: true,
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

};



export default function App() {
  return (
      <SearchProvider config={config}>
        <WithSearch mapContextToProps={({ wasSearched }) => ({wasSearched})}>
          {({ wasSearched }) => {
            return (
                <div className="App">
                  <ErrorBoundary>
                    <Layout
                        header={
                          <SearchBox
                              autocompleteMinimumCharacters={3}
                              autocompleteResults={{
                                linkTarget: "_blank",
                                sectionTitle: "Results",
                                filenameField: "filename",
                                ageField: "age",
                                durationField: "duration",
                                accentField: "accent",
                                shouldTrackClickThrough: true,
                                // clickThroughTags: ["test"]
                              }}
                              autocompleteSuggestions={false}
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
                        bodyContent={
                          <Results
                              shouldTrackClickThrough={true}
                          />
                        }
                        bodyHeader={
                          <React.Fragment>
                            {wasSearched && <PagingInfo />}
                            {wasSearched && <ResultsPerPage />}
                          </React.Fragment>
                        }
                        bodyFooter={<Paging />}
                    />
                  </ErrorBoundary>
                </div>
            );
          }}
        </WithSearch>
      </SearchProvider>
  );
}
