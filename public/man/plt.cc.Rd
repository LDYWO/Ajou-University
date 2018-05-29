\name{plt.cc}
\alias{plt.cc}
\encoding{latin1}
\title{Graphical outputs for canonical correlation analysis}
\description{
This function calls either \code{plt.var()} or \code{plt.indiv()} or both functions
to provide individual and/or variable representation on the canonical variates.
}
\usage{
plt.cc(res, d1 = 1, d2 = 2, int = 0.5, type = "b", ind.names = NULL,
var.label = FALSE, Xnames = NULL, Ynames = NULL)
}
\arguments{
  \item{res}{Object returned by \code{cc()} or \code{rcc()}}
  \item{d1}{The dimension that will be represented on the horizontal axis}
  \item{d2}{The dimension that will be represented on the vertical axis}
  \item{int}{The radius of the inner circle}
  \item{type}{Character "v" (variables), "i" (individuals) or "b" (both) to specifying
    the plot to be done.}
  \item{ind.names}{vector containing the names of the individuals}
  \item{var.label}{logical indicating whether label should be plotted on
  the variables representation}
  \item{Xnames}{vector giving the names of X variables}
  \item{Ynames}{vector giving the names of Y variables}
}

\references{www.lsp.ups-tlse.fr/Biopuces/CCA}

\author{Sébastien Déjean, Ignacio González}

\seealso{\code{\link{plt.indiv}}, \code{\link{plt.var}}  }

\examples{
data(nutrimouse)
X=as.matrix(nutrimouse$gene[,1:10])
Y=as.matrix(nutrimouse$lipid)
res.cc=cc(X,Y)
plt.cc(res.cc)
plt.cc(res.cc,d1=1,d2=3,type="v",var.label=TRUE)
}

\keyword{dplot}