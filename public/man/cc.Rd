\name{cc}
\alias{cc}
\encoding{latin1}
\title{Canonical Correlation Analysis}

\description{
The function performs Canonical Correlation Analysis to highlight correlations between
two data matrices. It complete the \code{cancor()} function with supplemental numerical and
graphical outputs and can handle missing values.
}

\usage{
cc(X, Y)
}


\arguments{
  \item{X}{numeric matrix (n * p), containing the X coordinates.}
  \item{Y}{numeric matrix (n * q), containing the Y coordinates.}
}

\details{
The canonical correlation analysis seeks linear combinations of
the 'X' variables which are the most correlated with linear
combinations of the 'Y' variables.

Let PX and PY be the projector onto the respective column-space of X and Y.
The eigenanalysis of PXPY provide the canonical correlations (square roots
of the eigenvalues) and the coefficients of linear combinations that define
the canonical variates (eigen vectors).

}

\value{
  A list containing the following components:
  \item{cor}{canonical correlations}
  \item{names}{a list containing the names to be used for individuals and variables
	for graphical outputs}
  \item{xcoef}{estimated coefficients for the 'X' variables as returned by \code{cancor()}}
  \item{ycoef}{estimated coefficients for the 'Y' variables as returned by \code{cancor()}}
  \item{scores}{a list returned by the internal function \code{comput()} containing individuals
and variables coordinates on the canonical variates basis.}
   
}

\references{www.lsp.ups-tlse.fr/CCA}

\author{Sébastien Déjean, Ignacio González}


\seealso{\code{\link{rcc}}, \code{\link{plt.cc}} }

\examples{
data(nutrimouse)
X=as.matrix(nutrimouse$gene[,1:10])
Y=as.matrix(nutrimouse$lipid)
res.cc=cc(X,Y)
plot(res.cc$cor,type="b")
plt.cc(res.cc)
}
\keyword{multivariate}