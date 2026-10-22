# Compare Entities with Dimensions

*ParameterPlotter user guide · English*

ParameterPlotter helps you record numeric Assessments for Entities in an E2R Dataset and compare them in four views. Try the built-in sample first, or open your own Dataset. Application version: **0.1.0**.

## Start with a Dataset

On Home, choose **Open Sample Dataset · The Ashen Crown** to explore the built-in example: 10 Entities, seven Dimensions, and 70 Assessments. The English or Japanese sample Dataset follows the UI language. Home also links to both versions of this guide. Choose **Open E2R Dataset** to select a JSON file, or **New Dataset** to start fresh.

If your browser already has work, replacing the Dataset and comparison workspace may show a confirmation. Choose **Cancel** to keep them; export changes you need before replacing them. A configured Hub link can open a Dataset at startup; a failed fetch or invalid response leaves the current Dataset unchanged.

## Set up comparison Dimensions

A Dimension defines what you want to compare, its numeric MIN and MAX, and optional endpoint labels. In the Workspace, use the Dimensions action to create or edit a Dimension. You can also set an optional unit and choose whether values must be integers. Keep each Dimension's scale meaningful for the question you are asking.

A Dimension Description is optional plain text; line breaks are preserved. If the app offers a Dataset upgrade before you add one, review and explicitly accept it.

If a change would make recorded values invalid, ParameterPlotter asks you to review a rescale before applying it. Existing values are not silently rounded or removed.

## Record and compare Assessments

Choose an Entity and enter an Assessment for a Dimension. Profile and Matrix provide direct numeric inputs; Profile can also use the range control when the value can be safely set. Clear a value explicitly to return it to the unassessed state. A recorded **0** is different from no Assessment. Leave a cell empty when no value is appropriate or available; ParameterPlotter does not infer scores from Entity names or relationships.

- **Profile** shows one Entity's values across Dimensions.
- **Radar** compares the selected primary Entity across chosen Dimensions. A secondary Entity is a visual comparison. Focus a plotted primary value and use the arrow keys to adjust it; each step follows that Dimension's range and integer rule.
- **Quadrant** compares Entities on selected X and Y Dimensions. Drag a point or focus it and use the arrow keys: Left/Right adjust X; Up/Down adjust Y. Enter or Space selects the Entity. Selection does not change its values.
- **Matrix** displays Entity-by-Dimension values. Edit a cell directly, reorder rows or columns where controls are shown, and use the page arrows to cycle through Dimensions.

View navigation and editing controls also support keyboard focus. The UI language can change independently of Dataset-authored names, labels, and descriptions.

## Keep and share your work

ParameterPlotter saves the working copy in this browser when local storage is available. This browser-local Workspace helps you continue here, but it is **not an exported Dataset file**. Use **More → Export E2R JSON** to request a portable download; check that the file was saved where you expect. Export again after changes you want to carry to another browser or app.

The workspace indicates whether changes have been exported and whether browser-local saving is available. If saving to browser storage fails, the in-memory work may be lost when you reload or close the browser. Export a file for a portable copy.

Use **More → Open E2R Dataset** to open another local file. A Hub startup link can retrieve a Dataset from its configured source. ParameterPlotter does not host or publish that source. Replacing loss-sensitive work requires explicit confirmation; Cancel keeps the active workspace.

## Examples and compatibility

Lighthouse Restoration Project and Cedar Observatory samples can also be used when their sources and a ParameterPlotter Hub action are configured. Unassessed cells are not treated as zero.

Dimension Assessment is currently a non-Stable Candidate extension. Another application may preserve extension data without supporting its display or editing. Export the E2R JSON before moving important work to another tool.

## Advanced workspace behavior

ParameterPlotter uses one editing tab per origin within the same browser profile. The first tab keeps its session even on Home. A second tab asks you to return to the original tab and cannot open or edit a Dataset. Closing the original does not automatically activate the duplicate. Reload or reopen ParameterPlotter to resume the last successfully saved Workspace. After navigating away and back, an ended session also requires reload. Unapplied form input is not guaranteed after a crash.

The first saved Dimension in a new Dataset creates Dimension Assessment data. On a Candidate 0.1.0 Dataset, explicitly choose the offered upgrade before adding a Dimension Description. The upgrade preserves existing IDs and values and does not create descriptions for you. Dimension Assessment `0.2.0` remains a separate, non-Stable Specification Candidate.

日本語版: [ユーザーガイド](user-guide-ja.md)
