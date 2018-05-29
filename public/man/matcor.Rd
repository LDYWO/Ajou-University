\name{matcor}
\alias{matcor}
\encoding{latin1}
\title{Correlations matrices}
\description{
The function computes the correlation matrices within and between two datasets.
}
\usage{
matcor(X, Y)
}

\arguments{
  \item{X}{numeric matrix (n * p), containing the X coordinates.}
  \item{Y}{numeric matrix (n * q), containing the Y coordinates.}
}



\value{
A list containing the following components:
  \item{Xcor}{Correlation matrix (p * p) for the X variables}
  \item{Ycor}{Correlation matrix (q * q) for the Y variables}
  \item{XYcor}{Correlation matrix ((p+q) * (p+q)) between X and Y variables}
}

\author{Sébastien Déjean, Ignacio González}

\seealso{\code{\link{img.matcor}}}

\examples{
data(nutrimouse)
X=as.matrix(nutrimouse$gene)
Y=as.matrix(nutrimouse$lipid)
correl=matcor(X,Y)
img.matcor(correl)
img.matcor(correl,type=2)
}
\keyword{multivariate}
