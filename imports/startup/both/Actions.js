import { Meteor } from 'meteor/meteor'
import React from 'react';
import { $ } from 'meteor/jquery'
import { AppConfig } from '/imports/startup/both/AppConfig.js';
import AppState from '/imports/startup/both/AppState.js'
import { GuestUser } from '/imports/api/user/guest_user.js';
import { GuestRigs } from '/imports/api/rigs/guest_rigs.js';
import { GuestRigComponents } from '/imports/api/rig_components/guest_rig_components.js';
import { deletePublicRig } from '/imports/api/public_rigs/methods.js';
import { slugify } from '/imports/api/lib/slugify.js';

let Actions = {}

if (Meteor.isClient) {
  Actions = {
    closeAllModals() {
      AppState.set({
        UserSettingsModalOpen: false,
        QuickViewModalOpen: false,
        ComparisonModalOpen: false,
        hit: {}
      })
    },

    toggleLeftDrawer(e) {
      if (e) { e.preventDefault() }
      if ( AppState.get('LeftDrawerOpen') ) {
        AppState.set({LeftDrawerOpen: false})
      } else {
        AppState.set({LeftDrawerOpen: true})
      }
    },

    toggleRightDrawer(e) {
      if (e) { e.preventDefault() }
      if ( AppState.get('RightDrawerOpen') ) {
        AppState.set({RightDrawerOpen: false})
      } else {
        AppState.set({RightDrawerOpen: true})
      }
    },

    toggleComparisonModal(e) {
      if (e) { e.preventDefault() }
      // console.log('toggleComparisonModal Fired!');
      // AppState.set({ComparisonModalOpen: true})
      if ( AppState.get('ComparisonModalOpen') ) {
        AppState.set({ComparisonModalOpen: false})
      } else {
        AppState.set({ComparisonModalOpen: true})
      }
    },

    openUserSettingsModal(e) {
      if (e) { e.preventDefault() }
      Actions.closeAllModals()
      AppState.set({UserSettingsModalOpen: true})
    },

    createNewBlankRig(e) {
      if (e) { e.preventDefault() }

      let title = 'New Rig'
      let nextNumber = 1
      title = `New Rig ${nextNumber}`

      while (!!GuestRigs.findOne({ title })) {
        nextNumber++
        title = `New Rig ${nextNumber}`
      }

      const newRigId = GuestRigs.insert({
        pk: AppState.get('pk'),
        title,
        desc: '',
        public: false,
        username: GuestUser.findOne().username,
        cost: '',
        costNumeric: 0.00,
        lastSelected: new Date(),
        createdAt: new Date(),
        //  owner: GuestUserId,
        //  slug: 'new-rig-1',
        //  components: [],
     })

     Actions.selectRig(newRigId)
     return newRigId
    },

    forkRig(e) {
      if (e) { e.preventDefault() }

      const currentRigId = AppState.get('currentRigId')
      let currentRig = GuestRigs.findOne(currentRigId)

      const title = !currentRig.title ? 'No Title' : `[Fork of: ${currentRig.title}]`

      const sourceRig = {
        ...currentRig,
        title,
        public: false,
        lastSelected: new Date(),
        createdAt: new Date(),
        forkSourceId: currentRig._id
      }

      // Create new rig
      sourceRigId = sourceRig._id
      delete sourceRig._id
      const newRigId = GuestRigs.insert(sourceRig)

      // Copy over all components from sourceRig to new rig in GuestRigComponents
      const sourceRigComponents = GuestRigComponents.find({rigId: sourceRigId}).fetch()

      sourceRigComponents.map((component) => {
        delete component._id
        component.rigId = newRigId
        GuestRigComponents.insert(component)
      })

      Actions.selectRig(newRigId)
      AppState.set({RightDrawerOpen: true})

      return newRigId
    },

    forkPublicRig(e, rig) {
      if (e) { e.preventDefault() }

      const title = !rig.title ? 'No Title' : `[Fork of: ${rig.title}]`

      const sourceRig = {
        ...rig,
        title,
        public: false,
        lastSelected: new Date(),
        createdAt: new Date(),
        forkSourceId: rig._id
      }

      // Create new rig
      sourceRigId = sourceRig._id
      delete sourceRig._id
      const newRigId = GuestRigs.insert(sourceRig)

      // Insert all components from sourceRig to GuestUser's rig in GuestRigComponents
      const sourceRigComponents = sourceRig.components
      sourceRigComponents.map((component) => {
        delete component._id
        component.rigId = newRigId
        GuestRigComponents.insert(component)
      })

      Actions.selectRig(newRigId)
      AppState.set({RightDrawerOpen: true})

      return newRigId
    },

    selectRig(rigId) {
      AppState.set('currentRigId', rigId)
      GuestRigs.update(rigId, { $set: { lastSelected: new Date() } })
    },

    deleteRig() {
      const pk = AppState.get('pk')
      const currentRigId = AppState.get('currentRigId')
      const opts = {}
      opts.pk = pk
      opts.rigId = currentRigId
      if (currentRigId) { // If it's blank it will delete all rigs, so yeah.
        GuestRigComponents.remove({rigId: currentRigId})
        GuestRigs.remove(currentRigId)
        deletePublicRig.call(opts, (e, r) => {
          if (r) {
            console.log('deletePublicRig > success response:', r);
          } else if (e) {
            console.log('deletePublicRig > error:', e);
          }
        })
      } else {
        console.log('Rig not deleted. No rig selected.');
      }

      // Get a rig (by lastSelected -1) or create new blank rig if it was the last one
      const mostRecentRig = GuestRigs.findOne({}, {sort: {lastSelected: -1}})
      if (mostRecentRig) {
        Actions.selectRig(mostRecentRig._id)
      } else {
        Actions.createNewBlankRig()
      }
    },

    addToRig(component) {
      AppState.set({RightDrawerOpen: true})
      // console.log(component);
      const rigId = AppState.get('currentRigId')
      const position = 1000;
      const { title, desc, type } = component
      const componentId = component._id
      let details = []

      for (var detail in component) {
        if (component.hasOwnProperty(detail)) {
          if ( component && component[detail] && (typeof component[detail] === 'string' || typeof component[detail] === 'number') ) {
            // console.log("%s: %s", typeof component[detail], detail);
            details.push({name: detail, value: component[detail]})
          }
        }
      }

      GuestRigComponents.insert({
        rigId,
        componentId,
        title,
        desc,
        position,
        type,
        details
      })
    },

    addCustomComponentToRig(e, component) {
      const rigId = AppState.get('currentRigId')
      const { title, link, price, desc } = component
      const position = 1000;

      GuestRigComponents.insert({
        rigId,
        componentId: null,
        custom: true,
        title,
        link,
        price,
        desc,
        position
      })
      // @todo - needs validation. See RigConfigurator/AddComponent.jsx for calling function
    },

    deleteFromRig(rigComponentId) {
      GuestRigComponents.remove(rigComponentId)
    },

    updateRigTitle(rigTitle) {
      const rigId = AppState.get('currentRigId')
      GuestRigs.update(rigId, {$set: { title: rigTitle }})
    },

    updateRigDesc(rigDesc) {
      const rigId = AppState.get('currentRigId')
      GuestRigs.update(rigId, {$set: { desc: rigDesc }})
    },

    shareRig(e) {
      console.log('triggered!');
    },

    exportRig(e) {
      if (e) { e.preventDefault() }

      // Get current rig data and store it in an object
      const rigId = AppState.get('currentRigId')
      const currentRig = GuestRigs.findOne(rigId)
      const rigComponents = GuestRigComponents.find({rigId}).fetch()
      console.log(rigComponents);

      // let exportData = { _id: currentRig._id, title: currentRig.title }
      let exportData = currentRig
      exportData.components = rigComponents
      const slug = slugify(exportData.title)

      const filename = slug + ".json"
      const filedata = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData))
      $('#download-link-container').html('')
      $('#download-link-container').append('Download: <a id="export-download-link"></a>')
      $('a#export-download-link').attr('href', filedata)
      $('a#export-download-link').attr('download', filename)
      $('a#export-download-link').text(filename)
    },

    // importRig(e) {
    //   ***> This is being handled in RigConfigurator/ImportRig.jsx
    // }

    _handleEscKeySearch(e) {
      // console.log('e.keyCode', e.keyCode);
      if(e.keyCode == 27 || e.keyCode == 13){ // 27 = [esc] key, 13 = [enter]
        window.helper.setQuery('').search()
        $('#Navbar-search-term').val('')
        $(e.target).blur()
      }
    },

    clearAlgoliaSearch(e) {
      if (e) { e.preventDefault() }

      AppState.set({isPaginating: false});
      window.helper.clearRefinements()
      window.helper.setQuery('')
      window.helper.setQueryParameter('hitsPerPage', AppConfig.paginationDefault).search();
      $('#Navbar-search-term').val('')
      AppState.set({algoliaActive: false})
    }
  }
} else {
  Actions = {}
}

if (Meteor.isClient) {
  window.Actions = Actions
}

export default Actions
