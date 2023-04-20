
export function Button(props) {
    const {children, onClick} = props
    return(
        <button onClick={onClick}>{children}</button>
    )
}