export interface IModelMeta {
	busy: boolean; 			// Object is being processed
	deleted: boolean; 		// Object has been flagged for deletion
	has_changed: boolean; 	// Data have been modified since fetched from server
	has_error: boolean; 	// Object has error.s
	loaded: boolean; 		// Object is completly instanciated (hydratation over)
	local: boolean; 		// Object only exist on client
	multi: boolean; 		// Object is an aggregation of several instances
	new: boolean; 			// Creation flag
	selected: boolean; 		// Object is currently selected
	url: string; 			// Object URI
}
