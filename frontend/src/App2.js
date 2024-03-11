
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


const connector =new  ElasticsearchAPIConnector({
  host: "http://localhost:9200",
  index: "my-example-movies",

});



const config = {
  searchQuery: {
    search_fields: {
      title: {
        weight: 3
      },
      plot: {},
      genre: {},
      actors: {},
      directors: {}
    },
    result_fields: {
      title: {
        snippet: {}
      },
      plot: {
        snippet: {}
      }
    },
    disjunctiveFacets: ["genre.keyword", "actors.keyword", "directors.keyword"],
    facets: {
      "genre.keyword": { type: "value" },
      "actors.keyword": { type: "value" },
      "directors.keyword": { type: "value" },
      released: {
        type: "range",
        ranges: [
          {
            from: "2012-04-07T14:40:04.821Z",
            name: "Within the last 10 years"
          },
          {
            from: "1962-04-07T14:40:04.821Z",
            to: "2012-04-07T14:40:04.821Z",
            name: "10 - 50 years ago"
          },
          {
            to: "1962-04-07T14:40:04.821Z",
            name: "More than 50 years ago"
          }
        ]
      },
      imdbRating: {
        type: "range",
        ranges: [
          { from: 1, to: 3, name: "Pants" },
          { from: 3, to: 6, name: "Mediocre" },
          { from: 6, to: 8, name: "Pretty Good" },
          { from: 8, to: 10, name: "Excellent" }
        ]
      }
    }
  },
  autocompleteQuery: {
    results: {
      resultsPerPage: 5,
      search_fields: {
        "title.suggest": {
          weight: 3
        }
      },
      result_fields: {
        title: {
          snippet: {
            size: 100,
            fallback: true
          }
        },
        url: {
          raw: {}
        }
      }
    },
    suggestions: {
      types: {
        results: { fields: ["movie_completion"] }
      },
      size: 4
    }
  },
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
                              autocompleteMinimumCharacters={3}
                              autocompleteResults={{
                                linkTarget: "_blank",
                                sectionTitle: "Results",
                                titleField: "title",
                                urlField: "url",
                                shouldTrackClickThrough: true
                              }}
                              autocompleteSuggestions={true}
                              debounceLength={0}
                          />
                        }
                        sideContent={
                          <div>
                            {wasSearched && <Sorting label={"Sort by"} sortOptions={[]}/>}
                            <Facet key={"1"} field={"genre.keyword"} label={"genre"}/>
                            <Facet key={"2"} field={"actors.keyword"} label={"actors"}/>
                            <Facet key={"3"} field={"directors.keyword"} label={"directors"}/>
                            <Facet key={"4"} field={"released"} label={"released"}/>
                            <Facet key={"5"} field={"imdbRating"} label={"imdb rating"}/>
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