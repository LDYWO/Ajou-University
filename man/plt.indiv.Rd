\name{plt.indiv}
\alias{plt.indiv}
\encoding{latin1}
\title{Individuals representation for CCA}
\description{
This function provides individuals representation on the canonical variates.
}
\usage{
plt.indiv(res, d1, d2, ind.names = NULL)
}

\arguments{
  \item{res}{Object returned by \code{cc()} or \code{rcc()}}
  \item{d1}{The dimension that will be represented on the horizontal axis}
  \item{d2}{The dimension that will be represented on the vertical axis}
  \item{ind.names}{vector containing the names of the individuals}
}

\references{www.lsp.ups-tlse.fr/Biopuces/CCA}

\author{Sébastien Déjean, Ignacio González}

\seealso{\code{\link{plt.var}}, \code{\link{plt.cc}}}

\keyword{dplot}