<template>
  <v-layout class="text-xs-left">
    <v-container fluid
                 grid-list-xl>
      <v-layout row
                wrap>
        <v-flex xs12
                sm9>
          <v-card>
            <v-toolbar prominent
                       extended>
              <v-container>
                <v-layout>
                  <v-toolbar-title>Group18: Noble gas interactions with proteins</v-toolbar-title>
                </v-layout>
                <v-layout>
                  <v-subheader> So, gone is the justification for “inert”. Now known collectively as the noble gases, a name intended to imply a kind of chemical aloofness rather than a rigorous chastity — Peter William
                    Atkins: In The Periodic Kingdom: A Journey Into the Land of the Chemical Elements (1995), 9.</v-subheader>
                </v-layout>
              </v-container>
            </v-toolbar>
            <v-card-text>
              <p>
                As outlined in the review
                <a href="https://www.ncbi.nlm.nih.gov/pubmed/26896563">
                  ”The diverse biological properties of the chemically inert noble gases” (Winkler et al., 2016)
                </a> there is a need to explore the possible interactions between the noble gases and proteins in order to provide viable candidates for clinical study. The drive behind the generation
                of this data is to provide a starting point for such exploration.
              </p>
              <p>The datasets accessible from this page were created using AutoGrid4 to systematically map the energy of five noble gas (
                <span class='element_He'>He</span>,
                <span class='element_Ne'>Ne</span>,
                <span class='element_Ar'>Ar</span>,
                <span class='element_Kr'>Kr</span>,
                <span class='element_Xe'>Xe</span>
                ) at all grid locations (in 0.375 Å steps) in all ~60,000 unique PDB structures filtered by 100% sequence similarity. This retains the highest resolution structure where multiple structures of the same
                proteins exist.
              </p>
              <p>
                Before the grid calculations, the proteins were carefully prepared using an automatic script to remove water and other solvents, small molecule ligands such as drugs, metal and small inorganic ions except
                those important for protein function, and small molecules except cofactors etc. essential for function. Given the very large number of proteins studied, it was not practical to hand curate
                each protein. Where structures included small molecular effectors e.g. enzyme substrates, products, inhibitors, or receptor agonists or antagonists, the proximity of the noble gas binding
                to the small molecule ligand binding site is available.
              </p>
              <p>
                For ease of navigation, each dataset has been divided into ‘high’, ‘medium’, and ‘low’ subsets, based on the lowest energy (kcal/mol) in each map. Thus, structures in the ‘low’ subset are those where noble
                gases do not appear to make any favorable interactions. The probability of productive binding relative to thermal energy is quantified by Natural information units (Nats) that are related
                to the Boltzmann distribution. Interactions with larger Nat values and smaller ligand distances are more likely to be interesting pharmacologically. Clearly, noble gases that bind with
                small energies that are comparable to thermal energies will not remain bound for long enough to affect the function of the protein.
              </p>
              <p>
                Clicking one of these datasets from the data tab opens the results in a Google Spreadsheet, allowing you to use text search or sort to find map files of particular interest.
              </p>
              <p>
                You can see the maps directly, either by clicking on a PDB Id. in the Google Spreadsheets (below), or by typing in a PDB Id. in the field above. Note that not all PDBs have been mapped. Multiple structures
                of the same protein are represented by the structure with the best resolution, some proteins with unusual functions (e.g. binding to DNA or RNA) may be missing, and a very small percentage
                of proteins were not processed correctly by the automatic protein preparation scripts. Protein multimers were not separated into the monomeric species but mapped as the multimer.
              </p>
              <p>
                The data is displayed using the 3D protein viewer
                <a href="http://jolecule.appspot.com/">
                  Jolecule
                </a>
              </p>
              <p>
                Jolecule optimizes a simple but rich interface that focuses on stereochemistry. The focus is on Richardson ribbons that join with sidechains correctly. Ligands are rendered as balls-and-sticks to allow
                the stereochemistry to be seen clearly, as well as arrows that are used to indicate directionality on both protein and DNA chains.
              </p>
              <p>Basic controls include:
                <br/> ZOOM: Right-Mouse, or Shift-Left-Mouse, or Pinch-Zoom
                <br/> DISTANCE LABELS: Drag from central atom
                <br/> ATOM LABELS: Double click on central atom
                <br/>
              </p>
              <br/>
              <p>
                <img id="jolecule_image"
                     src="static/assets/group18_jolecule_help.png"
                     alt="About Jolecule" />
              </p>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs12
                sm3>
          <v-card>
            <v-toolbar>
              <v-toolbar-title>API</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <p>
                You can directly access specific PDB records using:<br/>
                <br/>

                <strong>
                  <a href="#/?pdb=2bmm">
                    #/?pdb=2bmm</a>
                </strong>
                <br/>
                <br/> Just replace ‘2bmm’ with any 4-letter PDB identifier.<br/>
                <br/> By default, noble gases are shown only in positions that are energetically favourable (i.e., energy cutoff = “high”).<br/>
                <br/>
                <strong>
                  <a href="#/?pdb=2bmm&amp;cutoff=high">
                    #/?pdb=2bmm&amp;cutoff=high</a>
                </strong>
                <br/>
                <br/>The available cutoffs (in kcal/mol) are listed below and may also include any number between -0.5 and -2.0:<br/>
                <br/>
                <table id="cutoffTable">
                  <tr>
                    <td>cutoff</td>
                    <td>
                      <span class='element_He'>He</span>
                    </td>
                    <td>
                      <span class='element_Ne'>Ne</span>
                    </td>
                    <td>
                      <span class='element_Ar'>Ar</span>
                    </td>
                    <td>
                      <span class='element_Kr'>Kr</span>
                    </td>
                    <td>
                      <span class='element_Xe'>Xe</span>
                    </td>
                  </tr>
                  <tr>
                    <th>
                      <a href="#/?pdb=2bmm&cutoff=all">all</a>
                    </th>
                    <td>-0.3</td>
                    <td>-0.3</td>
                    <td>-0.3</td>
                    <td>-0.3</td>
                    <td>-0.3</td>
                    <td></td>
                  </tr>
                  <tr>
                    <th>
                      <a href="#/?pdb=2bmm&cutoff=veryHigh">veryHigh</a>
                    </th>
                    <td>-0.6</td>
                    <td>-0.6</td>
                    <td>-1.2</td>
                    <td>-1.2</td>
                    <td>-1.5</td>
                    <td></td>
                  </tr>
                  <tr>
                    <th>
                      <a href="#/?pdb=2bmm&cutoff=high">high</a>
                    </th>
                    <td>-0.4</td>
                    <td>-0.4</td>
                    <td>-0.9</td>
                    <td>-0.9</td>
                    <td>-1.3</td>
                    <td></td>
                  </tr>
                  <tr>
                    <th>
                      <a href="#/?pdb=2bmm&cutoff=medium">medium</a>
                    </th>
                    <td>-0.3</td>
                    <td>-0.3</td>
                    <td>-0.8</td>
                    <td>-0.8</td>
                    <td>-1.2</td>
                    <td></td>
                  </tr>
                  <tr>
                    <th>
                      <a href="#/?pdb=2bmm&cutoff=low">low</a>
                    </th>
                    <td>-0.3</td>
                    <td>-0.3</td>
                    <td>-0.6</td>
                    <td>-0.6</td>
                    <td>-0.8</td>
                    <td></td>
                  </tr>
                  <tr>
                    <th>
                      <a href="#/?pdb=2bmm&cutoff=-0.9">-0.9</a>
                    </th>
                    <td>-0.9</td>
                    <td>-0.9</td>
                    <td>-0.9</td>
                    <td>-0.9</td>
                    <td>-0.9</td>
                    <td></td>
                  </tr>
                  <tr>
                    <th>
                      <a href="#/?pdb=2bmm&cutoff=-1.2">-1.2</a>
                    </th>
                    <td>-1.2</td>
                    <td>-1.2</td>
                    <td>-1.2</td>
                    <td>-1.2</td>
                    <td>-1.2 </td>
                  </tr>
                  <tr>
                    <th colspan="6"
                        style="text-align:right;">
                      <i>etc...</i>
                    </th>
                  </tr>
                </table>
                <div class="date_published">May 17, 2017</div>
            </v-card-text>
          </v-card>
          <v-card id="contact"
                  name="contact"
                  class="panel body-side">
            <v-toolbar>
              <v-toolbar-title>Contacts</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <table id="contact-table">
                <tr>
                  <th colspan=2>Re: datasets</th>
                </tr>
                <tr>
                  <td>Name:</td>
                  <td>Mr Aaron Thornton</td>
                </tr>
                <tr>
                  <td>Position:</td>
                  <td>Senior Research Scientist, Manufacturing</td>
                </tr>
                <tr>
                  <td>Email:</td>
                  <td>
                    <span class="emale"
                          data-user="notnrohT.noraA"
                          data-website="ua.orisc"></span>
                  </td>
                </tr>
                <tr>
                  <td colspan=2></td>
                </tr>
                <tr>
                  <th colspan=2>Re: visualisation</th>
                </tr>
                <tr>
                  <td>Name:</td>
                  <td>Prof Sean O'Donoghue</td>
                </tr>
                <tr>
                  <td>Position:</td>
                  <td>Team Leader, Data61</td>
                </tr>
                <tr>
                  <td>Email:</td>
                  <td>
                    <span class="emale"
                          data-user="euhgonoD'O.naeS"
                          data-website="ua.orisc"></span>
                  </td>
                </tr>
              </table>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-layout>
</template>
<style scoped>
.emale:before {
  content: attr(data-website) '\0040' attr(data-user);
  unicode-bidi: bidi-override;
  direction: rtl;
}
#jolecule_image {
  width: 800px;
  height: 600px;
}

@font-face {
  font-family: Clip;
  src: url('/static/assets/Clip.ttf');
}
.element_Xe {
  background-color: #f59f7f;
  border-radius: 3px;
  padding: 2px;
}
.element_Kr {
  background-color: #add27a;
  border-radius: 3px;
  padding: 2px;
}
.element_Ar {
  background-color: #61c4be;
  border-radius: 3px;
  padding: 2px;
}
.element_Ne {
  background-color: #a0d2e3;
  border-radius: 3px;
  padding: 2px;
}
.element_He {
  background-color: #7b87c0;
  border-radius: 3px;
  padding: 2px;
}
#cutoffTable td {
  padding-left: 1em;
}
</style>

