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
              <p>As per
                <a href="http://dx.doi.org/10.1002/cmdc.201800434">
                  ”Decoding the rich biological properties of noble gases: how well can we predict noble gas binding to diverse proteins?” (Winkler et al., 2018)
                </a> the dataset accessible on this site was created using AutoGrid4 to systematically map the energy of five noble gas (
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
                The probability of productive binding relative to thermal energy is quantified by Natural information units (Nats) that are related to the Boltzmann distribution. Interactions with larger Nat values and
                smaller ligand distances are more likely to be interesting pharmacologically. Clearly, noble gases that bind with small energies that are comparable to thermal energies will not remain
                bound for long enough to affect the function of the protein.
              </p>
              <p>
                For ease of navigation, the dataset may be searched via "Search" field at the top of the view tab. The search field looks for partial matching text entries for PDB-Ids, Protein Type and/or Description(
                eg. "oxygen transport") You may also search for a range of number of atoms (eg. "1000:2000") or a range of minimum binding energies (eg "-1.5:-2.0"). These searches may be combined as a
                single separated query (eg. "oxygen transport 1000:2000 -1.6:-2.0"). Initially only a subset of all available grid positions will be displayed determined by a maximum binding energy level
                set on a slider. This may be adjusted in the range from -0.3 to -2.0 kCal/Mol. You may also adjust the elements you are interested to see in the visualisation from the "Element" drop down
                selection. You may also filter the elements displayed by clicking the appropriate button (
                <span class='element_He'>He</span>,
                <span class='element_Ne'>Ne</span>,
                <span class='element_Ar'>Ar</span>,
                <span class='element_Kr'>Kr</span>,
                <span class='element_Xe'>Xe</span>
                )
              </p>
              <p>
                Note that not all PDBs have been mapped. Multiple structures of the same protein are represented by the structure with the best resolution, some proteins with unusual functions (e.g. binding to DNA or
                RNA) may be missing, and a very small percentage of proteins were not processed correctly by the automatic protein preparation scripts. Protein multimers were not separated into the monomeric
                species but mapped as the multimer.
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
                     src="static/assets/group18-help.svg"
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
                <br/> By default, only a single noble gas (Xe) is shown in all calculated positions<br/>
                <br/> You can also choose additional or alternative noble gases to display<br/>
                <br/>
                <strong>
                  <a href="#/?pdb=2bmm&amp;elements=He,Ne">
                    #/?pdb=2bmm&amp;elements=He,Ne</a>
                </strong>
                <br/>
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
  content: attr(data-website) "\0040" attr(data-user);
  unicode-bidi: bidi-override;
  direction: rtl;
}
#jolecule_image {
  width: 90%;
  height: "AUTO";
}

@font-face {
  font-family: Clip;
  src: url("/static/assets/Clip.ttf");
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

