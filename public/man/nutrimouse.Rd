\name{nutrimouse}
\alias{nutrimouse}
\encoding{latin1}
\docType{data}
\title{Nutrimouse dataset}
  \description{
    The \code{nutrimouse} dataset comes from a nutrition study
    in the mouse. It was provided by Pascal Martin from
    the Toxicology and Pharmacology Laboratory (French National
    Institute for Agronomic Research).
}
\usage{data(nutrimouse)}
\format{
  A list containing the following components:
  \itemize{
  \item \code{gene}: data frame (40 * 120) with numerical variables
  \item \code{lipid}: data frame (40 * 21) with numerical variables
  \item \code{diet}: factor vector (40)
  \item \code{genotype}: factor vector (40)
  }

}
\details{
Two sets of variables were measured on 40 mice:
\itemize{
\item expressions of 120 genes potentially involved in nutritional problems.
    
\item concentrations of 21 hepatic fatty acids.

The 40 mice were distributed in a 2-factors experimental design (4
replicates):

\item Genotype (2-levels factor):  wild-type and PPARalpha -/-

\item Diet (5-levels factor): Oils used for experimental diets
preparation were corn and colza oils (50/50) for a reference diet (REF),
hydrogenated coconut oil for a saturated fatty acid diet (COC),
sunflower oil for an Omega6 fatty acid-rich diet (SUN), linseed oil for
an Omega3-rich diet (LIN) and corn/colza/enriched fish oils for the FISH
diet (43/43/14).
}    
}
\source{
  P. Martin, H. Guillou, F. Lasserre, S. Déjean, A. Lan, J-M. Pascussi,
  M. San Cristobal, P. Legrand, P. Besse, T. Pineau - Novel aspects of
  PPARalpha-mediated regulation of lipid and xenobiotic metabolism
  revealed through a nutrigenomic study. Hepatology, in press, 2007.
}
\references{
www.inra.fr/internet/Centres/toulouse/pharmacologie/pharmaco-moleculaire/acceuil.html
}
\examples{
data(nutrimouse)
boxplot(nutrimouse$lipid)
}
\keyword{datasets}
