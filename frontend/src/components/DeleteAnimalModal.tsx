interface DeleteProfileModalProps {
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteProfileModal({
  onCancel,
  onConfirm,
}: DeleteProfileModalProps) {
  return (
    <div 
      className="modal fade show" 
      style={{ display: "block" }} 
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalTitle"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="modalTitle">Confirmation de suppression</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onCancel}
            ></button>
          </div>
          <div className="modal-body">
            <p>
              Êtes-vous sûr de vouloir supprimer votre profil ? Cette action est
              <strong> irréversible</strong>.
            </p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
            >
              Annuler
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={onConfirm}
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}