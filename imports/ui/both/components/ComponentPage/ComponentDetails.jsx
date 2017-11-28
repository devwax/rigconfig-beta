import { Meteor } from 'meteor/meteor';
import React from "react";
import { Table } from "react-bootstrap";
import { ComponentTypesList } from '/imports/api/lib/ComponentTypes.js';
import { formatTitle } from '/imports/api/lib/formatTitle.js';

export function ComponentDetails({data, publicFields}) {
  let publicFieldsList = []
  let sources = []
  // let newegg_id = data.newegg_id
  // let asin = data.asin

  for (var field in publicFields) {
    if (publicFields.hasOwnProperty(field)) {
      if (field !== 'type' && field !== 'title' && field !== '_id' && field !== 'sources' && data[field]) {
        // Format array items into legible list (React concatenates them during render)
        if (data[field].constructor === Array) {
          if (data[field].length > 0) {
            data[field] = data[field].join(", ");
          } else {
            data[field] = undefined
          }
        }
        data[field] && publicFieldsList.push({name: field, value: data[field]})
      }

      if (field === 'sources') {
        const sources_obj = data['sources']
        for (var source in sources_obj) {
          // const value = () => {return (<a href={${sources_obj[source]}} dangerouslySetInnerHTML={${sources_obj[source]}></a>)}
          const value = <a href={sources_obj[source]} dangerouslySetInnerHTML={{__html: sources_obj[source]}} target="_source"></a>
          sources.push({name: source, value: value})
        }
      }
    }
  }
  // console.log(sources);

  return (
    <Table striped bordered condensed hover className="ComponentDetails">
      <tbody>
        { publicFieldsList.map((field, id) => <tr key={id}><td className="label">{formatTitle(field.name)}</td><td dangerouslySetInnerHTML={{__html: field.value}}></td></tr>) }
        { sources && sources.map((field, id) => <tr key={id}><td className="label">{formatTitle(field.name)}</td><td>{field.value}</td></tr>) }
      </tbody>
    </Table>
  )
}
