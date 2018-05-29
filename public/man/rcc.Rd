\name{rcc}
\alias{rcc}
\encoding{latin1}
\title{Regularized Canonical Correlation Analysis}
\description{
The function performs the Regularized extension of the Canonical Correlation Analysis
to seek correlations between two data matrices when the number of columns (variables)
exceeds the number of rows (observations)
}
\usage{
rcc(X, Y, lambda1, lambda2)
}

\arguments{
  \item{X}{numeric matrix (n * p), containing the X coordinates.}
  \item{Y}{numeric matrix (n * q), containing the Y coordinates.}
  \item{lambda1}{Regularization parameter for X}
  \item{lambda2}{Regularization parameter for Y}
}

\details{
When the number of columns is greater than the number of rows, the matrice 
X'X (and/or Y'Y) may be ill-conditioned. The regularization allows the inversion
by adding a term on the diagonal.
}

\value{
  A list containing the following components:
  \item{corr}{canonical correlations}
  \item{names}{a list containing the names to be used for individuals and variables
	for graphical outputs}
  \item{xcoef}{estimated coefficients for the 'X' variables as returned by \code{cancor()}}
  \item{ycoef}{estimated coefficients for the 'Y' variables as returned by \code{cancor()}}
  \item{scores}{a list returned by the internal function comput() containing individuals
and variables coordinates on the canonical variates basis.}
}

\references{

Leurgans, Moyeed and Silverman, (1993). Canonical correlation analysis
when the data are curves. J. Roy. Statist. Soc. Ser. B.  55, 725-740.

Vinod (1976). Canonical ridge and econometrics of joint production.
J. Econometr. 6, 129-137.}


\author{Sébastien Déjean, Ignacio González}


\seealso{\code{\link{cc}}, \code{\link{estim.regul}}, \code{\link{plt.cc}}}

\examples{
data(nutrimouse)
X=as.matrix(nutrimouse$gene)
Y=as.matrix(nutrimouse$lipid)
res.cc=rcc(X,Y,0.1,0.2)
plt.cc(res.cc)
}
\keyword{multivariate}
